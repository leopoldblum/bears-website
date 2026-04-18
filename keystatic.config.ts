import { config, collection, fields } from '@keystatic/core';
import { buildMdxComponents } from './src/keystatic/mdxComponents';

// ============================================================================
// STORAGE — local in dev, GitHub in production
// ============================================================================

const storage = process.env.NODE_ENV === 'production'
  ? {
      kind: 'github' as const,
      repo: {
        owner: process.env.KEYSTATIC_GITHUB_REPO_OWNER ?? 'BEARS-TUB',
        name: process.env.KEYSTATIC_GITHUB_REPO_NAME ?? 'bears-website',
      },
    }
  : { kind: 'local' as const };

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
// markdoc / document), not a plain text field. We use `fields.mdx()` with the
// file extension pinned per-collection.
//
// Data-only collections (.md with empty body) use extension 'md'. Events is
// mostly `.mdx`, so it pins 'mdx'. Projects and docs are mostly `.md` so they
// pin 'md'. Files whose extension does not match a collection's pinned
// extension are hidden from Keystatic — the public site still renders them.
//
// KNOWN LIMITATION: `.mdx` files with `import` statements at the top crash
// Keystatic when opened (mdxjsEsm nodes are unsupported). See README → Future
// work for the migration plan that removes imports.

// `components` must bind `fields.image` to a specific collection asset root,
// so body fields are built per-collection. Callers without an imageRoot get
// the legacy text-input Img block.
const mdBody = (imageRoot?: string) =>
  fields.mdx({
    label: 'Body',
    extension: 'md',
    components: buildMdxComponents({ imageRoot }),
  });

const mdxBody = (imageRoot?: string) =>
  fields.mdx({
    label: 'Body',
    extension: 'mdx',
    components: buildMdxComponents({ imageRoot }),
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

// ============================================================================
// COLLECTION FACTORIES — one factory per collection family,
// invoked once per locale / tier as needed.
// ============================================================================

function testimonialsCollection(locale: 'en' | 'de') {
  return collection({
    label: `Testimonials (${locale.toUpperCase()})`,
    slugField: 'name',
    path: `src/content/testimonials/${locale}/*`,
    columns: ['role'],
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      name: fields.slug({
        name: { label: 'Name', validation: { isRequired: true } },
      }),
      role: fields.text({ label: 'Role', validation: { isRequired: true } }),
      quote: fields.text({ label: 'Quote', multiline: true, validation: { isRequired: true } }),
      coverImage: imageField('Portrait image', 'src/assets/testimonials', '/src/assets/testimonials/'),
      // Testimonials have no rendered body — quote/name/role/coverImage are
      // the only fields consumed by TestimonialCard.astro. emptyContent
      // satisfies Keystatic's requirement that format.contentField map to a
      // ContentFormField, while rendering no body editor in the admin UI.
      body: fields.emptyContent({ extension: 'md' }),
    },
  });
}

function sponsorsCollection(tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze') {
  const tierLabel = tier[0].toUpperCase() + tier.slice(1);
  return collection({
    label: `Sponsors – ${tierLabel}`,
    slugField: 'name',
    path: `src/content/sponsors/${tier}/*`,
    columns: ['url'],
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      name: fields.slug({
        name: { label: 'Sponsor name', validation: { isRequired: true } },
      }),
      logo: imageField('Logo', `src/assets/sponsors/${tier}`, `/src/assets/sponsors/${tier}/`),
      url: fields.url({ label: 'Website URL' }),
      bgColor: fields.text({
        label: 'Background color (hex)',
        description: 'Applied behind the logo. Default #ffffff.',
        defaultValue: '#ffffff',
      }),
      body: fields.emptyContent({ extension: 'md' }),
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
    columns: ['date', 'categoryProject', 'isDraft', 'isProjectCompleted'],
    format: { contentField: 'body' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
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
      // Flat trio matching the Astro Zod schema in src/content/config.ts.
      // Keystatic's fields.conditional would nest these under a discriminant,
      // which diverges from the flat frontmatter the site code reads. Leaving
      // them flat + optional keeps both sides in sync. The Astro schema's
      // .refine() enforces "headOfProject + personImage are required when
      // displayMeetTheTeam is true" at build time.
      displayMeetTheTeam: fields.checkbox({
        label: 'Show this project in the "Meet the Team" section',
        defaultValue: false,
      }),
      headOfProject: fields.text({
        label: 'Head of project',
        description: 'Required when "Show in Meet the Team" is on.',
      }),
      personImage: fields.image({
        label: 'Head of project portrait',
        directory: 'src/assets/projects/team-members',
        publicPath: '',
        description: `Required when "Show in Meet the Team" is on. ${IMAGE_SIZE_HINT}`,
      }),
      body: mdBody('src/assets/projects'),
    },
  });
}

function pageTextCollection(locale: 'en' | 'de') {
  return collection({
    label: `Page Text (${locale.toUpperCase()})`,
    slugField: 'title',
    path: `src/content/page-text/${locale}/**`,
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      title: fields.slug({
        name: { label: 'Title', validation: { isRequired: true } },
      }),
      subtitle: fields.text({ label: 'Subtitle' }),
      description: fields.text({ label: 'Description', multiline: true }),
      seoDescription: fields.text({ label: 'SEO description', multiline: true }),
      buttonText: fields.text({ label: 'Primary button text' }),
      buttonHref: fields.text({ label: 'Primary button link' }),
      secondButtonText: fields.text({ label: 'Secondary button text' }),
      secondButtonHref: fields.text({ label: 'Secondary button link' }),
      ctas: fields.array(
        fields.object({
          title: fields.text({ label: 'Title', validation: { isRequired: true } }),
          description: fields.text({ label: 'Description', validation: { isRequired: true } }),
          href: fields.text({ label: 'Link', validation: { isRequired: true } }),
        }),
        {
          label: 'CTAs',
          itemLabel: (p) => p.fields.title.value || 'Untitled',
          validation: { length: { max: 4 } },
        },
      ),
      items: fields.array(fields.text({ label: 'Item' }), {
        label: 'Items',
        itemLabel: (p) => p.value || 'Empty',
      }),
      socialLinks: fields.array(
        fields.object({
          platform: fields.text({ label: 'Platform', validation: { isRequired: true } }),
          url: fields.url({ label: 'URL', validation: { isRequired: true } }),
          hoverColor: fields.text({ label: 'Hover color (hex)' }),
        }),
        {
          label: 'Social links',
          itemLabel: (p) => p.fields.platform.value || 'Untitled',
        },
      ),
      navLinks: fields.array(
        fields.object({
          label: fields.text({ label: 'Label', validation: { isRequired: true } }),
          href: fields.text({ label: 'Link', validation: { isRequired: true } }),
        }),
        {
          label: 'Nav links',
          itemLabel: (p) => p.fields.label.value || 'Untitled',
        },
      ),
      navColumns: fields.array(
        fields.object({
          heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
          href: fields.text({ label: 'Heading link', validation: { isRequired: true } }),
          links: fields.array(
            fields.object({
              label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              href: fields.text({ label: 'Link', validation: { isRequired: true } }),
            }),
            {
              label: 'Links',
              itemLabel: (p) => p.fields.label.value || 'Untitled',
            },
          ),
        }),
        {
          label: 'Nav columns',
          itemLabel: (p) => p.fields.heading.value || 'Untitled',
        },
      ),
      faqs: fields.array(
        fields.object({
          question: fields.text({ label: 'Question', validation: { isRequired: true } }),
          answer: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
        }),
        {
          label: 'FAQs',
          itemLabel: (p) => p.fields.question.value || 'Untitled',
        },
      ),
      instagramButtonText: fields.text({ label: 'Instagram button text' }),
      mediaCategories: fields.array(
        fields.object({
          id: fields.text({ label: 'ID', validation: { isRequired: true } }),
          label: fields.text({ label: 'Label', validation: { isRequired: true } }),
        }),
        {
          label: 'Media categories',
          itemLabel: (p) => p.fields.label.value || 'Untitled',
        },
      ),
      bankName: fields.text({ label: 'Bank name' }),
      accountHolder: fields.text({ label: 'Account holder' }),
      iban: fields.text({ label: 'IBAN' }),
      bic: fields.text({ label: 'BIC' }),
      reference: fields.text({ label: 'Transfer reference' }),
      paypalUrl: fields.url({ label: 'PayPal URL' }),
      paypalButtonText: fields.text({ label: 'PayPal button text' }),
      body: mdBody(),
    },
  });
}

function facesOfBearsCollection(locale: 'en' | 'de') {
  return collection({
    label: `Faces of BEARS (${locale.toUpperCase()})`,
    slugField: 'name',
    path: `src/content/faces-of-bears/${locale}/*`,
    columns: ['role'],
    format: { contentField: 'body' },
    entryLayout: 'form',
    schema: {
      name: fields.slug({
        name: { label: 'Name', validation: { isRequired: true } },
      }),
      role: fields.text({ label: 'Role', validation: { isRequired: true } }),
      coverImage: imageField('Portrait image', 'src/assets/faces-of-bears', '/src/assets/faces-of-bears/'),
      body: fields.emptyContent({ extension: 'md' }),
    },
  });
}

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
      }),
      description: fields.text({ label: 'Description', multiline: true }),
      order: fields.integer({
        label: 'Order',
        description: 'Sort order within this section (lower = first).',
        defaultValue: 0,
        validation: { isRequired: true },
      }),
      group: fields.text({ label: 'Group (optional)' }),
      body: mdBody(`src/assets/docs/${section}`),
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
  columns: ['type', 'shownText'],
  format: { contentField: 'body' },
  entryLayout: 'form',
  schema: {
    alt: fields.slug({
      name: {
        label: 'Alt text / slide ID',
        description:
          'Used as the filename and image alt text. Prefix with a number (e.g. "01-group-photo") to control order.',
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
    body: fields.emptyContent({ extension: 'md' }),
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
    date: fields.date({ label: 'Date', validation: { isRequired: true } }),
    isDraft: fields.checkbox({
      label: 'Draft',
      description: 'Drafts are hidden in production but visible in dev.',
      defaultValue: false,
    }),
    body: fields.emptyContent({ extension: 'md' }),
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
      'Homepage content': ['heroSlides', 'instagram'],
      'Events': ['eventsEn', 'eventsDe'],
      'Projects': ['projectsEn', 'projectsDe'],
      'Sponsors': [
        'sponsorsDiamond',
        'sponsorsPlatinum',
        'sponsorsGold',
        'sponsorsSilver',
        'sponsorsBronze',
      ],
      'Testimonials': ['testimonialsEn', 'testimonialsDe'],
      'Faces of BEARS': ['facesOfBearsEn', 'facesOfBearsDe'],
      'Page text': ['pageTextEn', 'pageTextDe'],
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
    pageTextEn: pageTextCollection('en'),
    pageTextDe: pageTextCollection('de'),
    facesOfBearsEn: facesOfBearsCollection('en'),
    facesOfBearsDe: facesOfBearsCollection('de'),
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
});
