import { config, collection, fields, singleton } from '@keystatic/core';
import { buildMdxComponents } from './src/keystatic/mdxComponents';

// ============================================================================
// STORAGE — GitHub (content edits commit directly to the repo)
// ============================================================================

const storage = {
  kind: 'github' as const,
  repo: {
    owner: 'leopoldblum',
    name: 'bears-website',
  },
};

// ============================================================================
// FIELD HELPERS — shared between collections
// ============================================================================

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
const MEDIA_EXTENSIONS = [...IMAGE_EXTENSIONS, 'mp4', 'webm', 'ogg'];

// Keystatic loads the whole file into memory as a Uint8Array and base64-encodes
// it on save — large uploads freeze the admin tab for many seconds. The library
// exposes no maxSize / resize option in v0.5, so we warn editors in the field
// description to pre-resize instead.
const IMAGE_SIZE_HINT =
  'Larger images (>2 MB) will freeze the tab during upload — just let it run and it will go through after a while. Smaller images are preferred (try squoosh.app to shrink first).';

// Keystatic scopes uploads inside `directory` with a per-entry subfolder
// (e.g. src/assets/events/test/coverImage.jpg for event "test"). We intentionally
// pass an empty publicPath so the frontmatter stores a path relative to the
// collection's asset base dir — e.g. `test/coverImage.jpg`. The image loaders
// in src/utils/imageLoader.ts already prepend the baseDir, so this matches both
// the legacy flat-filename entries (coverImage: "event-8.jpg") and the new
// slug-subfolder entries from Keystatic. Globs in src/utils/imageGlobs.ts must
// use `**/*.*` so subfolder files are picked up.
function imageField(label: string, directory: string, _publicPath: string) {
  return fields.image({
    label,
    directory,
    publicPath: '',
    description: IMAGE_SIZE_HINT,
    validation: { isRequired: true },
  });
}

// Keystatic's `contentField` must reference a real content field (mdx /
// markdoc / document), not a plain text field. All content is stored as
// `.mdx` so the collections share a single body helper.
//
// `components` must bind `fields.image` to a specific collection asset root,
// so body fields are built per-collection. Callers without an imageRoot get
// the legacy text-input Img block.
const mdxBody = (imageRoot?: string, opts: { includePreview?: boolean } = {}) =>
  fields.mdx({
    label: 'Body',
    extension: 'mdx',
    components: buildMdxComponents({ imageRoot, includePreview: opts.includePreview }),
  });

const EVENT_CATEGORIES = [
  { label: 'Trade Fairs & Conventions', value: 'trade-fairs-and-conventions' },
  { label: 'Competitions & Workshops', value: 'competitions-and-workshops' },
  { label: 'Kick-off Events', value: 'kick-off-events' },
  { label: 'Other', value: 'other' },
] as const;

const PROJECT_CATEGORIES = [
  { label: 'Experimental Rocketry', value: 'experimental-rocketry' },
  { label: 'Science & Experiments', value: 'science-and-experiments' },
  { label: 'Robotics', value: 'robotics' },
  { label: 'Other', value: 'other' },
] as const;

// Each value maps to a hard-coded image glob in src/pages/media.astro
// (`globById`). Adding a new value here without also wiring it up in
// media.astro will silently load zero images. "all" is the special aggregate.
const MEDIA_CATEGORY_IDS = [
  { label: 'About Us images', value: 'about-us' },
  { label: 'Event covers', value: 'events' },
  { label: 'People portraits', value: 'people' },
  { label: 'Hero slides', value: 'hero' },
  { label: 'Project covers', value: 'projects' },
  { label: 'Testimonial portraits', value: 'testimonials' },
  { label: 'What is BEARS images', value: 'what-is-bears' },
  { label: 'All (aggregates every category above)', value: 'all' },
] as const;

// ============================================================================
// COLLECTION FACTORIES — one factory per collection family,
// invoked once per locale / tier as needed.
// ============================================================================

function testimonialsCollection(locale: 'en' | 'de') {
  return collection({
    label: `Testimonials (${locale.toUpperCase()})`,
    slugField: 'name',
    path: `src/content/testimonials/${locale}/*`,
    columns: ['order', 'role'],
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      name: fields.slug({
        name: { label: 'Name', validation: { isRequired: true } },
      }),
      order: fields.integer({
        label: 'Order',
        description: 'Sort order (lower = shown first). Ties fall back to the slug.',
        defaultValue: 0,
        validation: { isRequired: true },
      }),
      role: fields.text({ label: 'Role', validation: { isRequired: true } }),
      quote: fields.text({ label: 'Quote', multiline: true, validation: { isRequired: true } }),
      coverImage: imageField('Portrait image', 'src/assets/testimonials', '/src/assets/testimonials/'),
      // Testimonials have no rendered body — quote/name/role/coverImage are
      // the only fields consumed by TestimonialCard.astro. emptyContent
      // satisfies Keystatic's requirement that format.contentField map to a
      // ContentFormField, while rendering no body editor in the admin UI.
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function sponsorsCollection(tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze') {
  const tierLabel = tier[0].toUpperCase() + tier.slice(1);
  return collection({
    label: `Sponsors – ${tierLabel}`,
    slugField: 'name',
    path: `src/content/sponsors/${tier}/*`,
    columns: ['order', 'url'],
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      name: fields.slug({
        name: { label: 'Sponsor name', validation: { isRequired: true } },
      }),
      order: fields.integer({
        label: 'Order',
        description: 'Sort order within this tier (lower = shown first). Ties fall back to the sponsor name. Note: the landing page\'s "Become a Sponsor" section only shows the top 3 non-empty tiers (diamond → bronze priority) — sponsors in lower tiers still appear on the dedicated Sponsors page.',
        defaultValue: 0,
        validation: { isRequired: true },
      }),
      logo: imageField('Logo', `src/assets/sponsors/${tier}`, `/src/assets/sponsors/${tier}/`),
      url: fields.url({ label: 'Website URL' }),
      bgColor: fields.text({
        label: 'Background color (hex)',
        description: 'Applied behind the logo. Default #ffffff.',
        defaultValue: '#ffffff',
      }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function eventsCollection(locale: 'en' | 'de') {
  return collection({
    label: `Events (${locale.toUpperCase()})`,
    slugField: 'title',
    path: `src/content/events/${locale}/*`,
    columns: ['date', 'categoryEvent', 'isDraft'],
    format: { contentField: 'body' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
        slug: {
          label: 'URL slug',
          description:
            "Do not change after publishing — this appears in the event's public URL (/events/…). Renaming breaks inbound links, SEO, and shared bookmarks.",
          validation: {
            length: { min: 3, max: 80 },
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Lowercase letters, digits, and single hyphens only.',
            },
          },
        },
      }),
      description: fields.text({
        label: 'Short description',
        multiline: true,
        validation: { isRequired: true },
      }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      categoryEvent: fields.select({
        label: 'Category',
        options: EVENT_CATEGORIES,
        defaultValue: 'other',
      }),
      coverImage: imageField('Cover image', 'src/assets/events', '/src/assets/events/'),
      isDraft: fields.checkbox({
        label: 'Draft',
        description: 'Drafts are hidden in production but visible in dev.',
        defaultValue: false,
      }),
      body: mdxBody('src/assets/events'),
    },
  });
}

function projectsCollection(locale: 'en' | 'de') {
  return collection({
    label: `Projects (${locale.toUpperCase()})`,
    slugField: 'title',
    path: `src/content/projects/${locale}/*`,
    columns: ['date', 'categoryProject', 'isDraft', 'isProjectCompleted', 'displayMeetTheTeam'],
    format: { contentField: 'body' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
        slug: {
          label: 'URL slug',
          description:
            "Do not change after publishing — this appears in the project's public URL (/projects/…). Renaming breaks inbound links, SEO, and shared bookmarks.",
          validation: {
            length: { min: 3, max: 80 },
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Lowercase letters, digits, and single hyphens only.',
            },
          },
        },
      }),
      description: fields.text({
        label: 'Short description',
        multiline: true,
        validation: { isRequired: true },
      }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      categoryProject: fields.select({
        label: 'Category',
        options: PROJECT_CATEGORIES,
        defaultValue: 'other',
      }),
      coverImage: imageField('Cover image', 'src/assets/projects', '/src/assets/projects/'),
      isDraft: fields.checkbox({
        label: 'Draft',
        description: 'Drafts are hidden in production but visible in dev.',
        defaultValue: false,
      }),
      isProjectCompleted: fields.checkbox({
        label: 'Project completed',
        description: 'Marks the project as completed (vs ongoing).',
        defaultValue: false,
      }),
      // Meet the Team is wired through the unified `people` collection: editors
      // pick a person from the dropdown rather than typing a name + uploading a
      // duplicate photo. The Astro Zod schema's .refine() enforces "person is
      // required when displayMeetTheTeam is true" at build time — Keystatic
      // can't express that cross-field requirement natively.
      displayMeetTheTeam: fields.checkbox({
        label: 'Show this project in the "Meet the Team" section',
        defaultValue: false,
      }),
      person: fields.relationship({
        label: 'Head of project',
        description: 'Pick from the People collection. Required when "Show in Meet the Team" is on. If the person does not exist yet, create them in the People group first.',
        collection: 'people',
      }),
      body: mdxBody('src/assets/projects'),
    },
  });
}

// Page-text content is fully split into per-file Keystatic singletons so each
// editor form shows only the fields the file actually uses. The Astro Zod
// schema in src/content/config.ts stays permissive (all fields optional)
// since entries from every shape live in one `page-text` collection.
//
// Layout on disk:
//   src/content/page-text/<locale>/<section>/<entry>.mdx — per-file singleton
//   src/content/page-text/<locale>/hero.mdx              — singleton
//   src/content/page-text/<locale>/faq.mdx               — singleton
//   ...etc. Each singleton picks one of the shape helpers below for its schema.

function pageTextCtasField() {
  return fields.array(
    fields.object({
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', validation: { isRequired: true } }),
      href: fields.text({ label: 'Link', validation: { isRequired: true } }),
    }),
    {
      label: 'Call to Action buttons',
      description: 'Up to 4 CTA buttons shown below the hero headline. Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.title.value || 'Untitled',
      validation: { length: { max: 4 } },
    },
  );
}

function pageTextItemsField() {
  return fields.array(fields.text({ label: 'Item' }), {
    label: 'Items',
    description: 'Drag the handle on the left of each item to reorder them.',
    itemLabel: (p) => p.value || 'Empty',
  });
}

function pageTextTitledItemsField() {
  return fields.array(
    fields.object({
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
    }),
    {
      label: 'Items',
      description: 'Each item has a bold title and an optional description. Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.title.value || 'Untitled',
    },
  );
}

function pageTextFaqsField() {
  return fields.array(
    fields.object({
      question: fields.text({ label: 'Question', validation: { isRequired: true } }),
      answer: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
    }),
    {
      label: 'FAQs',
      description: 'Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.question.value || 'Untitled',
    },
  );
}

function pageTextSocialLinksField() {
  return fields.array(
    fields.object({
      platform: fields.text({ label: 'Platform', validation: { isRequired: true } }),
      iconFile: fields.file({
        label: 'Icon (SVG)',
        description: 'Upload a single-color SVG icon (24×24 viewBox, any fill). The icon is rendered as a silhouette via CSS mask so the hover color can be applied — colors inside the SVG are ignored. Same icon can be reused across entries by uploading once and then typing the filename into other entries.',
        directory: 'src/assets/social-icons',
        publicPath: '',
        validation: { isRequired: true },
      }),
      url: fields.url({ label: 'URL', validation: { isRequired: true } }),
      hoverColor: fields.text({ label: 'Hover color (hex)' }),
    }),
    {
      label: 'Social links',
      description: 'Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.platform.value || 'Untitled',
    },
  );
}

function pageTextNavLinksField() {
  return fields.array(
    fields.object({
      label: fields.text({ label: 'Label', validation: { isRequired: true } }),
      href: fields.text({ label: 'Link', validation: { isRequired: true } }),
    }),
    {
      label: 'Nav links',
      description: 'Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.label.value || 'Untitled',
    },
  );
}

function pageTextNavColumnsField() {
  return fields.array(
    fields.object({
      heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
      href: fields.text({ label: 'Heading link', validation: { isRequired: true } }),
      links: fields.array(
        fields.object({
          label: fields.text({ label: 'Label', validation: { isRequired: true } }),
          href: fields.text({ label: 'Link', validation: { isRequired: true } }),
        }),
        {
          label: 'Sub-headings',
          description: 'Drag the handle on the left of each item to reorder them.',
          itemLabel: (p) => p.fields.label.value || 'Untitled',
        },
      ),
    }),
    {
      label: 'Navigation columns',
      description: 'Drag the handle on the left of each column to reorder them.',
      itemLabel: (p) => p.fields.heading.value || 'Untitled',
    },
  );
}

function pageTextMediaCategoriesField() {
  return fields.array(
    fields.object({
      id: fields.select({
        label: 'Category',
        description: 'Which image set this entry pulls from. The list is fixed — adding a new option requires a code change in src/pages/media.astro.',
        options: MEDIA_CATEGORY_IDS,
        defaultValue: 'about-us',
      }),
      label: fields.text({
        label: 'Label',
        description: 'Heading shown above this category on the Media page (locale-specific).',
        validation: { isRequired: true },
      }),
    }),
    {
      label: 'Media categories',
      description: 'Drag the handle on the left of each item to reorder them.',
      itemLabel: (p) => p.fields.label.value || 'Untitled',
    },
  );
}

// ---- Per-file singleton shape helpers ------------------------------------
//
// Each section file in src/content/page-text/<locale>/<section>/ gets its own
// Keystatic singleton, scoped to one of these shapes. Editors only see the
// fields the file actually uses.

type Locale = 'en' | 'de';

function baseSingletonMeta(locale: Locale, pathSuffix: string, label: string) {
  return {
    label: `${label} (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/${pathSuffix}`,
    format: { contentField: 'body' as const },
    entryLayout: 'form' as const,
  };
}

function pageHeaderSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, `${label} + SEO`),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      seoDescription: fields.text({
        label: 'SEO description',
        description: 'Shown as the <meta name="description"> for this page (~150 characters).',
        multiline: true,
      }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function sectionSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function sectionWithButtonSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      buttonText: fields.text({ label: 'Button text' }),
      buttonHref: fields.text({ label: 'Button link' }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function crosslinkSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      buttonText: fields.text({ label: 'Button text', validation: { isRequired: true } }),
      buttonHref: fields.text({ label: 'Button link', validation: { isRequired: true } }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function listSectionSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      items: pageTextItemsField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function titledListSectionSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      titledItems: pageTextTitledItemsField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function findUsSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      room: fields.text({
        label: 'Room label',
        description: 'Large text next to the map — the room/building where you meet.',
      }),
      schedule: fields.text({
        label: 'Meeting time',
        description: 'Rendered below the room label — when the meetings happen.',
      }),
      mapLat: fields.number({
        label: 'Map pin latitude',
        description:
          'Latitude of the pin shown on the "Where to find us" map. Tip: open google.com/maps, right-click the spot you want, and the first number in the popup is the latitude (e.g. 52.5154444).',
        validation: { min: -90, max: 90 },
      }),
      mapLng: fields.number({
        label: 'Map pin longitude',
        description:
          'Longitude of the pin shown on the "Where to find us" map. Tip: open google.com/maps, right-click the spot you want, and the second number in the popup is the longitude (e.g. 13.3238611).',
        validation: { min: -180, max: 180 },
      }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function sponsorTiersSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      tierDescriptions: fields.object(
        {
          diamond: fields.text({ label: 'Diamond' }),
          platinum: fields.text({ label: 'Platinum' }),
          gold: fields.text({ label: 'Gold' }),
          silver: fields.text({ label: 'Silver' }),
          bronze: fields.text({ label: 'Bronze' }),
        },
        { label: 'Tier descriptions' },
      ),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function latestNewsSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
      buttonText: fields.text({ label: 'Primary button text' }),
      buttonHref: fields.text({ label: 'Primary button link' }),
      secondButtonText: fields.text({ label: 'Secondary button text' }),
      secondButtonHref: fields.text({ label: 'Secondary button link' }),
      instagramButtonText: fields.text({ label: 'Instagram button text' }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function titleOnlySingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function legalPageSingleton(locale: Locale, pathSuffix: string, label: string) {
  return singleton({
    ...baseSingletonMeta(locale, pathSuffix, label),
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      body: mdxBody(),
    },
  });
}


function pageTextHeroSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Landing hero + SEO (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/hero`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      seoDescription: fields.text({ label: 'SEO description', multiline: true }),
      ctas: pageTextCtasField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextFaqSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `FAQ (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/faq`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      faqs: pageTextFaqsField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextMediaCategoriesSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Media categories + SEO (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/media-categories`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      subtitle: fields.text({ label: 'Subtitle' }),
      seoDescription: fields.text({ label: 'SEO description', multiline: true }),
      mediaCategories: pageTextMediaCategoriesField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextNavColumnsSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Footer navigation (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/nav-columns`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      navColumns: pageTextNavColumnsField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextSocialSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Social links (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/social`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      socialLinks: pageTextSocialLinksField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextDonateSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Donate (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/donate`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
      items: pageTextItemsField(),
      accountHolder: fields.text({ label: 'Account holder' }),
      bankName: fields.text({ label: 'Bank name' }),
      iban: fields.text({ label: 'IBAN' }),
      bic: fields.text({ label: 'BIC' }),
      reference: fields.text({ label: 'Transfer reference' }),
      paypalUrl: fields.url({ label: 'PayPal URL' }),
      paypalButtonText: fields.text({ label: 'PayPal button text' }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextSiteMetadataSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Site metadata (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/site/metadata`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Site title', validation: { isRequired: true } }),
      description: fields.text({
        label: 'Site description',
        description: 'Used as the default <meta name="description"> for the site.',
        multiline: true,
        validation: { isRequired: true },
      }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextFooterAddressSingleton(locale: 'en' | 'de') {
  return singleton({
    label: `Footer address (${locale.toUpperCase()})`,
    path: `src/content/page-text/${locale}/footer/footer-address`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.text({ label: 'Heading', validation: { isRequired: true } }),
      address: fields.text({
        label: 'Address',
        description: 'One line per row. Press Enter to start a new line.',
        multiline: true,
        validation: { isRequired: true, length: { min: 1 } },
      }),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

function pageTextNavLinksCollection(locale: 'en' | 'de') {
  return collection({
    label: `Nav link lists (${locale.toUpperCase()})`,
    slugField: 'title',
    path: `src/content/page-text/${locale}/nav-links/*`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
        slug: {
          label: 'ID',
          description:
            'Do not rename — these IDs (e.g. "header", "footer-bottom") are referenced directly from code. Renaming silently replaces the content with hardcoded English defaults.',
          validation: {
            length: { min: 3, max: 80 },
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Lowercase letters, digits, and single hyphens only.',
            },
          },
        },
      }),
      navLinks: pageTextNavLinksField(),
      body: fields.emptyContent({ extension: 'mdx' }),
    },
  });
}

// The People collection is locale-agnostic — name and portrait are shared
// across languages, only `role` translates. Editors maintain a single record
// per person; the Faces of BEARS grid filters by `showInFaces`, while project
// Meet-the-Team entries link via a relationship() field on `projects`.
const peopleCollection = collection({
  label: 'People',
  slugField: 'name',
  path: 'src/content/people/*',
  columns: ['showInFaces', 'order', 'roleEn'],
  format: { contentField: 'body' },
  entryLayout: 'form',
  schema: {
    name: fields.slug({
      name: { label: 'Name', validation: { isRequired: true } },
    }),
    roleEn: fields.text({
      label: 'Role (English)',
      validation: { isRequired: true },
    }),
    roleDe: fields.text({
      label: 'Rolle (Deutsch)',
      validation: { isRequired: true },
    }),
    coverImage: imageField('Portrait image', 'src/assets/people', '/src/assets/people/'),
    showInFaces: fields.checkbox({
      label: 'Show in the "Faces of BEARS" grid',
      description: 'Off by default. People referenced only from a project (Meet the Team) can stay off — turning this on surfaces the entry in the grid on the About us page.',
      defaultValue: false,
    }),
    order: fields.integer({
      label: 'Order',
      description: 'Only meaningful when "Show in Faces of BEARS" is on — lower numbers appear first in the grid. Ignored for people that are not shown in the grid.',
      defaultValue: 0,
      validation: { isRequired: true },
    }),
    body: fields.emptyContent({ extension: 'mdx' }),
  },
});

function docsCollection(section: 'guides' | 'dev') {
  const sectionLabel = section === 'guides' ? 'Guides' : 'Dev Docs';
  return collection({
    label: `Docs – ${sectionLabel}`,
    slugField: 'title',
    path: `src/content/docs/${section}/*`,
    columns: ['order', 'group'],
    format: { contentField: 'body' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
        slug: {
          label: 'URL slug',
          description:
            "Do not change after publishing — this appears in the doc's public URL (/docs/…). Renaming breaks inbound links, SEO, and shared bookmarks.",
          validation: {
            length: { min: 3, max: 80 },
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Lowercase letters, digits, and single hyphens only.',
            },
          },
        },
      }),
      description: fields.text({ label: 'Description', multiline: true }),
      order: fields.integer({
        label: 'Order',
        description: 'Sort order within this section (lower = first).',
        defaultValue: 0,
        validation: { isRequired: true },
      }),
      group: fields.text({ label: 'Group (optional)' }),
      body: mdxBody(`src/assets/docs/${section}`, { includePreview: true }),
    },
  });
}

// ============================================================================
// SINGLETON-LIKE COLLECTIONS (not per locale / tier)
// ============================================================================

const heroSlides = collection({
  label: 'Hero Slides',
  slugField: 'alt',
  path: 'src/content/hero-slides/*',
  columns: ['order', 'type', 'shownText'],
  format: { contentField: 'body' },
  entryLayout: 'form',
  schema: {
    order: fields.integer({
      label: 'Order',
      description: 'Slides are shown in ascending order of this number. Ties fall back to filename.',
      defaultValue: 0,
      validation: { isRequired: true },
    }),
    alt: fields.slug({
      name: {
        label: 'Alt text / slide ID',
        description: 'Used as the filename and image alt text.',
        validation: { isRequired: true },
      },
    }),
    type: fields.select({
      label: 'Media type',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
      defaultValue: 'image',
    }),
    media: fields.file({
      label: 'Media file',
      description: `Supported: ${MEDIA_EXTENSIONS.join(', ')}. Larger files (images >2 MB, videos >10 MB) will freeze the tab during upload — just let it run and it will go through eventually. Smaller files are preferred (squoosh.app for images, HandBrake/ffmpeg for videos).`,
      directory: 'src/assets/hero/landingpage',
      publicPath: '/src/assets/hero/landingpage/',
      validation: { isRequired: true },
    }),
    shownText: fields.text({ label: 'Overlay text (optional)' }),
    body: fields.emptyContent({ extension: 'mdx' }),
  },
});

const instagram = collection({
  label: 'Instagram Posts',
  slugField: 'url',
  path: 'src/content/instagram/*',
  columns: ['date', 'isDraft'],
  format: { contentField: 'body' },
  entryLayout: 'form',
  schema: {
    url: fields.slug({
      name: {
        label: 'Instagram post URL',
        description: 'Full URL of the Instagram post. Used as slug.',
        validation: { isRequired: true },
      },
    }),
    date: fields.date({
      label: 'Date',
      description: 'Posts are sorted newest first. Only the 3 most recent posts are shown on the homepage.',
      validation: { isRequired: true },
    }),
    isDraft: fields.checkbox({
      label: 'Draft',
      description: 'Drafts are hidden in production but visible in dev.',
      defaultValue: false,
    }),
    body: fields.emptyContent({ extension: 'mdx' }),
  },
});

// ============================================================================
// CONFIG
// ============================================================================

export default config({
  storage,
  ui: {
    brand: { name: 'BEARS' },
    navigation: {
      // --- Main content (no page-text mingled in) ---------------------------
      'Hero slides': ['heroSlides'],
      'Events': ['eventsEn', 'eventsDe'],
      'Projects': ['projectsEn', 'projectsDe'],
      'Sponsors': ['sponsorsDiamond', 'sponsorsPlatinum', 'sponsorsGold', 'sponsorsSilver', 'sponsorsBronze'],
      'Testimonials': ['testimonialsEn', 'testimonialsDe'],
      'People': ['people'],
      'Instagram': ['instagram'],
      // --- Page text (per-page sub-groups, clustered by "Page text — " prefix)
      'Static Page Text - Landing': [
        'pageTextHeroEn', 'pageTextHeroDe',
        'pageTextLandingWhatIsBearsEn', 'pageTextLandingWhatIsBearsDe',
        'pageTextLandingMeetTheTeamEn', 'pageTextLandingMeetTheTeamDe',
        'pageTextLandingTestimonialsEn', 'pageTextLandingTestimonialsDe',
        'pageTextLandingLatestNewsEn', 'pageTextLandingLatestNewsDe',
        'pageTextLandingBecomeSponsorEn', 'pageTextLandingBecomeSponsorDe',
      ],
      'Static Page Text - About us': [
        'pageTextAboutUsTitleEn', 'pageTextAboutUsTitleDe',
        'pageTextAboutUsOurMissionEn', 'pageTextAboutUsOurMissionDe',
        'pageTextAboutUsWhatsInItEn', 'pageTextAboutUsWhatsInItDe',
        'pageTextAboutUsFindUsEn', 'pageTextAboutUsFindUsDe',
        'pageTextAboutUsFacesOfBearsEn', 'pageTextAboutUsFacesOfBearsDe',
        'pageTextFaqEn', 'pageTextFaqDe',
        'pageTextAboutUsFaqCrosslinkEn', 'pageTextAboutUsFaqCrosslinkDe',
      ],
      'Static Page Text - Events': [
        'pageTextEventsTitleEn', 'pageTextEventsTitleDe',
        'pageTextEventsIntroEn', 'pageTextEventsIntroDe',
        'pageTextEventsEmptyStateEn', 'pageTextEventsEmptyStateDe',
        'pageTextEventsCrosslinkEn', 'pageTextEventsCrosslinkDe',
      ],
      'Static Page Text - Projects': [
        'pageTextProjectsTitleEn', 'pageTextProjectsTitleDe',
        'pageTextProjectsCategoriesIntroEn', 'pageTextProjectsCategoriesIntroDe',
        'pageTextProjectsCategoryRocketryEn', 'pageTextProjectsCategoryRocketryDe',
        'pageTextProjectsCategoryRoboticsEn', 'pageTextProjectsCategoryRoboticsDe',
        'pageTextProjectsCategoryScienceEn', 'pageTextProjectsCategoryScienceDe',
        'pageTextProjectsEmptyStateEn', 'pageTextProjectsEmptyStateDe',
        'pageTextProjectsCrosslinkEn', 'pageTextProjectsCrosslinkDe',
      ],
      'Static Page Text - Sponsors': [
        'pageTextSponsorsTitleEn', 'pageTextSponsorsTitleDe',
        'pageTextSponsorsIntroEn', 'pageTextSponsorsIntroDe',
        'pageTextSponsorsTiersEn', 'pageTextSponsorsTiersDe',
        'pageTextSponsorsBecomeSponsorCtaEn', 'pageTextSponsorsBecomeSponsorCtaDe',
        'pageTextSponsorsCrosslinkEn', 'pageTextSponsorsCrosslinkDe',
      ],
      'Static Page Text - Contact': [
        'pageTextContactTitleEn', 'pageTextContactTitleDe',
        'pageTextContactInfoEn', 'pageTextContactInfoDe',
        'pageTextContactCrosslinkEn', 'pageTextContactCrosslinkDe',
        'pageTextDonateEn', 'pageTextDonateDe',
      ],
      'Static Page Text - Media': ['pageTextMediaCategoriesEn', 'pageTextMediaCategoriesDe'],
      'Static Page Text - Legal & utility pages': [
        'pageTextImprintEn', 'pageTextImprintDe',
        'pageTextDatenschutzEn', 'pageTextDatenschutzDe',
        'pageText404En', 'pageText404De',
      ],
      'Static Page Text - Site-wide (nav, footer, meta)': [
        'pageTextNavLinksEn', 'pageTextNavLinksDe',
        'pageTextNavColumnsEn', 'pageTextNavColumnsDe',
        'pageTextFooterAddressEn', 'pageTextFooterAddressDe',
        'pageTextSocialEn', 'pageTextSocialDe',
        'pageTextSiteMetadataEn', 'pageTextSiteMetadataDe',
      ],
      // --- Docs -------------------------------------------------------------
      'Docs': ['docsGuides', 'docsDev'],
    },
  },
  collections: {
    // Bilingual
    testimonialsEn: testimonialsCollection('en'),
    testimonialsDe: testimonialsCollection('de'),
    eventsEn: eventsCollection('en'),
    eventsDe: eventsCollection('de'),
    projectsEn: projectsCollection('en'),
    projectsDe: projectsCollection('de'),
    pageTextNavLinksEn: pageTextNavLinksCollection('en'),
    pageTextNavLinksDe: pageTextNavLinksCollection('de'),
    // Locale-agnostic: one entry per person; roles translate inline.
    people: peopleCollection,
    // Tier-split sponsors
    sponsorsDiamond: sponsorsCollection('diamond'),
    sponsorsPlatinum: sponsorsCollection('platinum'),
    sponsorsGold: sponsorsCollection('gold'),
    sponsorsSilver: sponsorsCollection('silver'),
    sponsorsBronze: sponsorsCollection('bronze'),
    // Section-split docs
    docsGuides: docsCollection('guides'),
    docsDev: docsCollection('dev'),
    // Flat
    heroSlides,
    instagram,
  },
  singletons: {
    // Site-wide
    pageTextHeroEn: pageTextHeroSingleton('en'),
    pageTextHeroDe: pageTextHeroSingleton('de'),
    pageTextSiteMetadataEn: pageTextSiteMetadataSingleton('en'),
    pageTextSiteMetadataDe: pageTextSiteMetadataSingleton('de'),
    pageTextFooterAddressEn: pageTextFooterAddressSingleton('en'),
    pageTextFooterAddressDe: pageTextFooterAddressSingleton('de'),
    pageTextFaqEn: pageTextFaqSingleton('en'),
    pageTextFaqDe: pageTextFaqSingleton('de'),
    pageTextMediaCategoriesEn: pageTextMediaCategoriesSingleton('en'),
    pageTextMediaCategoriesDe: pageTextMediaCategoriesSingleton('de'),
    pageTextNavColumnsEn: pageTextNavColumnsSingleton('en'),
    pageTextNavColumnsDe: pageTextNavColumnsSingleton('de'),
    pageTextSocialEn: pageTextSocialSingleton('en'),
    pageTextSocialDe: pageTextSocialSingleton('de'),
    pageTextDonateEn: pageTextDonateSingleton('en'),
    pageTextDonateDe: pageTextDonateSingleton('de'),
    // Landing page sections
    pageTextLandingWhatIsBearsEn: sectionWithButtonSingleton('en', 'landing/what-is-bears', 'Landing — What is BEARS?'),
    pageTextLandingWhatIsBearsDe: sectionWithButtonSingleton('de', 'landing/what-is-bears', 'Landing — What is BEARS?'),
    pageTextLandingMeetTheTeamEn: titleOnlySingleton('en', 'landing/meet-the-team', 'Landing — Meet the team heading'),
    pageTextLandingMeetTheTeamDe: titleOnlySingleton('de', 'landing/meet-the-team', 'Landing — Meet the team heading'),
    pageTextLandingTestimonialsEn: titleOnlySingleton('en', 'landing/testimonials', 'Landing — Testimonials heading'),
    pageTextLandingTestimonialsDe: titleOnlySingleton('de', 'landing/testimonials', 'Landing — Testimonials heading'),
    pageTextLandingLatestNewsEn: latestNewsSingleton('en', 'landing/latest-news', 'Landing — Latest news'),
    pageTextLandingLatestNewsDe: latestNewsSingleton('de', 'landing/latest-news', 'Landing — Latest news'),
    pageTextLandingBecomeSponsorEn: sectionWithButtonSingleton('en', 'landing/become-sponsor', 'Landing — Become a sponsor'),
    pageTextLandingBecomeSponsorDe: sectionWithButtonSingleton('de', 'landing/become-sponsor', 'Landing — Become a sponsor'),
    // About us page sections
    pageTextAboutUsTitleEn: pageHeaderSingleton('en', 'about-us/about-us-title', 'About us — page header'),
    pageTextAboutUsTitleDe: pageHeaderSingleton('de', 'about-us/about-us-title', 'About us — page header'),
    pageTextAboutUsOurMissionEn: sectionSingleton('en', 'about-us/our-mission', 'About us — Our mission'),
    pageTextAboutUsOurMissionDe: sectionSingleton('de', 'about-us/our-mission', 'About us — Our mission'),
    pageTextAboutUsWhatsInItEn: titledListSectionSingleton('en', 'about-us/whats-in-it', "About us — What's in it for you"),
    pageTextAboutUsWhatsInItDe: titledListSectionSingleton('de', 'about-us/whats-in-it', "About us — What's in it for you"),
    pageTextAboutUsFindUsEn: findUsSingleton('en', 'about-us/find-us', 'About us — When/where to find us'),
    pageTextAboutUsFindUsDe: findUsSingleton('de', 'about-us/find-us', 'About us — When/where to find us'),
    pageTextAboutUsFacesOfBearsEn: sectionSingleton('en', 'about-us/faces-of-bears', 'About us — Faces of BEARS heading'),
    pageTextAboutUsFacesOfBearsDe: sectionSingleton('de', 'about-us/faces-of-bears', 'About us — Faces of BEARS heading'),
    pageTextAboutUsFaqCrosslinkEn: crosslinkSingleton('en', 'about-us/faq-crosslink', 'About us — FAQ crosslink'),
    pageTextAboutUsFaqCrosslinkDe: crosslinkSingleton('de', 'about-us/faq-crosslink', 'About us — FAQ crosslink'),
    // Contact page sections
    pageTextContactTitleEn: pageHeaderSingleton('en', 'contact/contact-title', 'Contact — page header'),
    pageTextContactTitleDe: pageHeaderSingleton('de', 'contact/contact-title', 'Contact — page header'),
    pageTextContactInfoEn: listSectionSingleton('en', 'contact/contact-info', 'Contact — Reach out info'),
    pageTextContactInfoDe: listSectionSingleton('de', 'contact/contact-info', 'Contact — Reach out info'),
    pageTextContactCrosslinkEn: crosslinkSingleton('en', 'contact/contact-crosslink', 'Contact — Join crosslink'),
    pageTextContactCrosslinkDe: crosslinkSingleton('de', 'contact/contact-crosslink', 'Contact — Join crosslink'),
    // Events page sections
    pageTextEventsTitleEn: pageHeaderSingleton('en', 'events/events-title', 'Events — page header'),
    pageTextEventsTitleDe: pageHeaderSingleton('de', 'events/events-title', 'Events — page header'),
    pageTextEventsIntroEn: sectionSingleton('en', 'events/events-intro', 'Events — Intro'),
    pageTextEventsIntroDe: sectionSingleton('de', 'events/events-intro', 'Events — Intro'),
    pageTextEventsEmptyStateEn: sectionSingleton('en', 'events/events-empty-state', 'Events — Empty state'),
    pageTextEventsEmptyStateDe: sectionSingleton('de', 'events/events-empty-state', 'Events — Empty state'),
    pageTextEventsCrosslinkEn: crosslinkSingleton('en', 'events/events-crosslink', 'Events — Projects crosslink'),
    pageTextEventsCrosslinkDe: crosslinkSingleton('de', 'events/events-crosslink', 'Events — Projects crosslink'),
    // Projects page sections
    pageTextProjectsTitleEn: pageHeaderSingleton('en', 'projects/projects-title', 'Projects — page header'),
    pageTextProjectsTitleDe: pageHeaderSingleton('de', 'projects/projects-title', 'Projects — page header'),
    pageTextProjectsCategoriesIntroEn: sectionSingleton('en', 'projects/categories-intro', 'Projects — Categories intro'),
    pageTextProjectsCategoriesIntroDe: sectionSingleton('de', 'projects/categories-intro', 'Projects — Categories intro'),
    pageTextProjectsCategoryRocketryEn: sectionSingleton('en', 'projects/category-experimental-rocketry', 'Projects — Category: experimental rocketry'),
    pageTextProjectsCategoryRocketryDe: sectionSingleton('de', 'projects/category-experimental-rocketry', 'Projects — Category: experimental rocketry'),
    pageTextProjectsCategoryRoboticsEn: sectionSingleton('en', 'projects/category-robotics', 'Projects — Category: robotics'),
    pageTextProjectsCategoryRoboticsDe: sectionSingleton('de', 'projects/category-robotics', 'Projects — Category: robotics'),
    pageTextProjectsCategoryScienceEn: sectionSingleton('en', 'projects/category-science-and-experiments', 'Projects — Category: science & experiments'),
    pageTextProjectsCategoryScienceDe: sectionSingleton('de', 'projects/category-science-and-experiments', 'Projects — Category: science & experiments'),
    pageTextProjectsEmptyStateEn: sectionSingleton('en', 'projects/projects-empty-state', 'Projects — Empty state'),
    pageTextProjectsEmptyStateDe: sectionSingleton('de', 'projects/projects-empty-state', 'Projects — Empty state'),
    pageTextProjectsCrosslinkEn: crosslinkSingleton('en', 'projects/projects-crosslink', 'Projects — Events crosslink'),
    pageTextProjectsCrosslinkDe: crosslinkSingleton('de', 'projects/projects-crosslink', 'Projects — Events crosslink'),
    // Sponsors page sections
    pageTextSponsorsTitleEn: pageHeaderSingleton('en', 'sponsors/sponsors-title', 'Sponsors — page header'),
    pageTextSponsorsTitleDe: pageHeaderSingleton('de', 'sponsors/sponsors-title', 'Sponsors — page header'),
    pageTextSponsorsIntroEn: sectionSingleton('en', 'sponsors/sponsors-intro', 'Sponsors — Intro'),
    pageTextSponsorsIntroDe: sectionSingleton('de', 'sponsors/sponsors-intro', 'Sponsors — Intro'),
    pageTextSponsorsTiersEn: sponsorTiersSingleton('en', 'sponsors/sponsor-tiers', 'Sponsors — Tier descriptions'),
    pageTextSponsorsTiersDe: sponsorTiersSingleton('de', 'sponsors/sponsor-tiers', 'Sponsors — Tier descriptions'),
    pageTextSponsorsBecomeSponsorCtaEn: sectionWithButtonSingleton('en', 'sponsors/become-sponsor-cta', 'Sponsors — Become a sponsor CTA'),
    pageTextSponsorsBecomeSponsorCtaDe: sectionWithButtonSingleton('de', 'sponsors/become-sponsor-cta', 'Sponsors — Become a sponsor CTA'),
    pageTextSponsorsCrosslinkEn: crosslinkSingleton('en', 'sponsors/sponsors-crosslink', 'Sponsors — Projects crosslink'),
    pageTextSponsorsCrosslinkDe: crosslinkSingleton('de', 'sponsors/sponsors-crosslink', 'Sponsors — Projects crosslink'),
    // Legal & utility pages
    pageText404En: sectionWithButtonSingleton('en', '404/not-found', '404 — Not found'),
    pageText404De: sectionWithButtonSingleton('de', '404/not-found', '404 — Not found'),
    pageTextDatenschutzEn: legalPageSingleton('en', 'datenschutz/datenschutz', 'Privacy policy'),
    pageTextDatenschutzDe: legalPageSingleton('de', 'datenschutz/datenschutz', 'Privacy policy'),
    pageTextImprintEn: legalPageSingleton('en', 'imprint/imprint', 'Imprint'),
    pageTextImprintDe: legalPageSingleton('de', 'imprint/imprint', 'Imprint'),
  },
});
