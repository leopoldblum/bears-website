/**
 * Keystatic MDX component registry.
 *
 * Each entry here lets content editors insert the matching `.astro` MDX
 * component via the Keystatic editor toolbar. The React previews rendered
 * inside Keystatic are intentionally simple visual placeholders — the real
 * Astro components render at build time.
 *
 * When you add, rename, or change the prop shape of a component in
 * src/components/mdx/, update both this registry AND the corresponding
 * Astro component. Keep the field names and types in sync.
 */
import React from 'react';
import { fields, NotEditable } from '@keystatic/core';
import { block, inline, wrapper, mark, repeating } from '@keystatic/core/content-components';

// ============================================================================
// PREVIEW HELPERS — minimal styles kept inline to avoid coupling to site CSS
//
// Keystatic supports both light and dark themes. We avoid hardcoded light
// backgrounds / dark text (which disappear on the dark theme) by using
// semi-transparent colors derived from `currentColor`, so the previews adapt
// to whichever theme Keystatic is showing.
// ============================================================================

const box: React.CSSProperties = {
  border: '1px dashed color-mix(in srgb, currentColor 35%, transparent)',
  borderRadius: 6,
  padding: '0.75rem 1rem',
  margin: '0.5rem 0',
  background: 'color-mix(in srgb, currentColor 5%, transparent)',
  fontFamily: 'sans-serif',
  fontSize: 14,
  color: 'inherit',
};

const label: React.CSSProperties = {
  fontWeight: 600,
  opacity: 0.75,
  textTransform: 'uppercase',
  fontSize: 11,
  letterSpacing: 0.5,
};

// ============================================================================
// IMG BLOCK FACTORY
//
// `fields.image` requires a static `directory`, so to let every body-field
// write uploads into its own collection's asset folder we build the Img
// block per-collection via `buildMdxComponents({ imageRoot })`. Callers
// without an imageRoot (page-text, hero-slides, instagram) get the legacy
// text-input variant so bodies written against the old schema keep loading.
// ============================================================================

function makeImgBlock(imageRoot?: string) {
  if (!imageRoot) {
    return block({
      label: 'Image',
      description: 'Responsive image. Pass a path relative to /src/assets/ or a public URL.',
      schema: {
        src: fields.text({ label: 'Image path', validation: { isRequired: true } }),
        alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
        width: fields.text({ label: 'Width (CSS, default 100%)', defaultValue: '100%' }),
        sizes: fields.text({ label: 'sizes attribute (optional)' }),
        enableClickToEnlarge: fields.checkbox({
          label: 'Click to enlarge',
          description: 'When on, clicking the image opens a full-resolution modal.',
          defaultValue: true,
        }),
        loading: fields.select({
          label: 'Loading',
          description: 'Use "eager" only for above-the-fold images.',
          options: [
            { label: 'Lazy (default)', value: 'lazy' },
            { label: 'Eager', value: 'eager' },
          ],
          defaultValue: 'lazy',
        }),
        fetchpriority: fields.select({
          label: 'Fetch priority',
          options: [
            { label: 'Auto (default)', value: 'auto' },
            { label: 'High', value: 'high' },
            { label: 'Low', value: 'low' },
          ],
          defaultValue: 'auto',
        }),
      },
      ContentView: ({ value }) => (
        <div style={box}>
          <div style={label}>Image</div>
          <NotEditable>
            <code style={{ fontSize: 12 }}>{value.src || '(no src)'}</code>
            <div style={{ opacity: 0.7, fontSize: 12 }}>{value.alt}</div>
          </NotEditable>
        </div>
      ),
    });
  }

  return block({
    label: 'Image',
    description: "Upload an image — it's saved into this entry's own asset folder.",
    schema: {
      src: fields.image({
        label: 'Image',
        directory: imageRoot,
        // Keystatic's getSrcPrefix(publicPath, slug) stores the full path in
        // the MDX (e.g. `/src/assets/events/<slug>/foo.jpg`), which Img.astro
        // resolves against the `allAssetImages` glob.
        publicPath: `/${imageRoot}/`,
        validation: { isRequired: true },
        description:
          'Large images (>2 MB) freeze the tab during upload — pre-resize with squoosh.app first.',
      }),
      alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
      width: fields.text({ label: 'Width (CSS, default 100%)', defaultValue: '100%' }),
      sizes: fields.text({ label: 'sizes attribute (optional)' }),
      enableClickToEnlarge: fields.checkbox({
        label: 'Click to enlarge',
        description: 'When on, clicking the image opens a full-resolution modal.',
        defaultValue: true,
      }),
      loading: fields.select({
        label: 'Loading',
        description: 'Use "eager" only for above-the-fold images.',
        options: [
          { label: 'Lazy (default)', value: 'lazy' },
          { label: 'Eager', value: 'eager' },
        ],
        defaultValue: 'lazy',
      }),
      fetchpriority: fields.select({
        label: 'Fetch priority',
        options: [
          { label: 'Auto (default)', value: 'auto' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' },
        ],
        defaultValue: 'auto',
      }),
    },
    ContentView: ({ value }) => {
      // fields.image form state is { data, extension, filename } during
      // upload; the persisted reader value is the string path.
      const displaySrc =
        typeof value.src === 'string'
          ? value.src
          : value.src?.filename
            ? `${value.src.filename} (uploading)`
            : '(no src)';
      return (
        <div style={box}>
          <div style={label}>Image</div>
          <NotEditable>
            <code style={{ fontSize: 12 }}>{displaySrc}</code>
            <div style={{ opacity: 0.7, fontSize: 12 }}>{value.alt}</div>
          </NotEditable>
        </div>
      );
    },
  });
}

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

type MdxComponentsOptions = {
  /**
   * Collection asset root (e.g. `src/assets/events`). When set, the Img
   * block offers an upload widget that writes into `<imageRoot>/<slug>/`.
   * Omit to keep the legacy text-based Img.
   */
  imageRoot?: string;
};

const sharedBlocks = {
  Accordion: block({
    label: 'Accordion',
    description:
      'Collapsible FAQ-style sections. Each item has a title, optional subtitle, and Markdown content.',
    schema: {
      mode: fields.select({
        label: 'Display mode',
        description:
          'Pick how items open/close. A short description of the chosen mode shows in the block preview after you click Done.',
        options: [
          { label: 'Single — start closed', value: 'single-closed' },
          { label: 'Single — first open', value: 'single-open' },
          { label: 'Always one open', value: 'always-one' },
          { label: 'Multiple', value: 'multi' },
        ],
        defaultValue: 'single-closed',
      }),
      items: fields.array(
        fields.object({
          title: fields.text({ label: 'Title', validation: { isRequired: true } }),
          subtitle: fields.text({ label: 'Subtitle (optional)' }),
          content: fields.text({
            label: 'Content (Markdown)',
            multiline: true,
            validation: { isRequired: true },
          }),
        }),
        {
          label: 'Items',
          itemLabel: (p) => p.fields.title.value || 'Untitled',
        },
      ),
      width: fields.text({ label: 'Width (CSS)', defaultValue: '100%' }),
      // Legacy props — kept so old MDX content using the pre-`mode` API still
      // validates. The Accordion Astro component still honours these when
      // `mode` is unset. New content should use `mode` instead.
      defaultOpen: fields.integer({
        label: 'Default open (legacy)',
        description: 'Deprecated — use “Display mode” instead. Index of the item that starts expanded.',
      }),
      allowCloseAll: fields.checkbox({
        label: 'Allow close all (legacy)',
        description: 'Deprecated — use “Display mode” instead.',
        defaultValue: true,
      }),
      allowMultiple: fields.checkbox({
        label: 'Allow multiple (legacy)',
        description: 'Deprecated — use “Display mode” instead.',
        defaultValue: false,
      }),
    },
    ContentView: ({ value }) => {
      const MODE_DESCRIPTIONS: Record<string, string> = {
        'single-closed': 'Only one open at a time. Click to open, click again to close. Starts with all closed.',
        'single-open': 'Only one open at a time. First item starts expanded. Click another to switch, click the open one to close.',
        'always-one': 'First item starts expanded and cannot be closed. Clicking another item switches which one is open.',
        'multi': 'Any number of items can be open at once. Each item toggles independently.',
      };
      const MODE_LABELS: Record<string, string> = {
        'single-closed': 'Single — start closed',
        'single-open': 'Single — first open',
        'always-one': 'Always one open',
        'multi': 'Multiple',
      };
      const modeLabel = MODE_LABELS[value.mode] ?? value.mode;
      const modeDescription = MODE_DESCRIPTIONS[value.mode] ?? '';
      const firstOpenIndex =
        value.mode === 'single-open' || value.mode === 'always-one' ? 0 : -1;
      return (
        <div style={box}>
          <div style={label}>Accordion — {modeLabel}</div>
          <NotEditable>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              {modeDescription}
            </div>
            {value.items.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.6, fontStyle: 'italic' }}>
                No items yet — click Edit to add some.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid color-mix(in srgb, currentColor 15%, transparent)',
                }}
              >
                {value.items.map((item, i) => {
                  const isOpen = i === firstOpenIndex;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '0.4rem 0.6rem',
                        background: isOpen
                          ? 'color-mix(in srgb, currentColor 8%, transparent)'
                          : 'transparent',
                        borderBottom:
                          i < value.items.length - 1
                            ? '1px solid color-mix(in srgb, currentColor 10%, transparent)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13 }}>
                          {item.title || <em style={{ opacity: 0.5 }}>Untitled</em>}
                        </span>
                        {item.subtitle ? (
                          <span style={{ fontSize: 11, opacity: 0.6 }}>
                            {item.subtitle}
                          </span>
                        ) : null}
                        <span style={{ fontSize: 10, opacity: 0.45, marginLeft: 'auto' }}>
                          {isOpen ? '▾ open' : '▸ closed'}
                        </span>
                      </div>
                      {isOpen && item.content ? (
                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.75,
                            marginTop: 4,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.content.length > 140
                            ? item.content.slice(0, 140) + '…'
                            : item.content}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </NotEditable>
        </div>
      );
    },
  }),

  AiPromptBlock: wrapper({
    label: 'AI prompt block',
    description:
      'Collapsible container with Copy and Expand/Collapse buttons — wraps a code block for the AI help guide.',
    schema: {
      label: fields.text({
        label: 'Header label',
        defaultValue: 'AI Context Prompt',
      }),
    },
    ContentView: ({ value, children }) => (
      <div style={box}>
        <div style={label}>{value.label || 'AI Context Prompt'}</div>
        <div>{children}</div>
      </div>
    ),
  }),

  Button: inline({
    label: 'Button',
    description: 'A styled button or link.',
    schema: {
      href: fields.text({ label: 'Link (optional — renders <a> if set)' }),
      variant: fields.select({
        label: 'Color',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Inverse', value: 'inverse' },
        ],
        defaultValue: 'primary',
      }),
      size: fields.select({
        label: 'Size',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Large', value: 'large' },
          { label: 'Extra large', value: 'xlarge' },
        ],
        defaultValue: 'standard',
      }),
      disabled: fields.checkbox({
        label: 'Disabled',
        description: 'Renders the button greyed-out and non-interactive.',
        defaultValue: false,
      }),
      content: fields.text({ label: 'Button text', validation: { isRequired: true } }),
    },
    NodeView: ({ value }) => {
      const variant = value.variant || 'primary';
      const size = value.size || 'standard';
      const variantStyle: React.CSSProperties =
        variant === 'secondary'
          ? {
              background: 'transparent',
              color: 'inherit',
              border: '2px solid #C50E1F',
            }
          : variant === 'inverse'
            ? {
                background: 'linear-gradient(to bottom, #303030, #2B2B2B)',
                color: '#E1E1E1',
                border: '2px solid transparent',
              }
            : {
                background: '#C50E1F',
                color: '#E1E1E1',
                border: '2px solid transparent',
              };
      const sizeStyle: React.CSSProperties =
        size === 'xlarge'
          ? { padding: '0.6rem 1.5rem', fontSize: 18 }
          : size === 'large'
            ? { padding: '0.4rem 1.2rem', fontSize: 15 }
            : { padding: '0.25rem 0.9rem', fontSize: 13 };
      return (
        <NotEditable>
          <span
            style={{
              display: 'inline-block',
              borderRadius: 999,
              fontWeight: 500,
              ...variantStyle,
              ...sizeStyle,
              ...(value.disabled ? { opacity: 0.4, filter: 'grayscale(1)' } : null),
            }}
          >
            {value.content || 'Button'}
          </span>
        </NotEditable>
      );
    },
  }),

  Callout: wrapper({
    label: 'Callout',
    description: 'Highlighted content block with an optional title.',
    schema: {
      title: fields.text({ label: 'Title (optional)' }),
    },
    ContentView: ({ value, children }) => (
      <div
        style={{
          ...box,
          background: 'color-mix(in srgb, #4d88ff 12%, transparent)',
          borderStyle: 'solid',
          borderColor: 'color-mix(in srgb, #4d88ff 50%, transparent)',
        }}
      >
        <div style={label}>Callout</div>
        {value.title ? (
          <NotEditable>
            <strong>{value.title}</strong>
          </NotEditable>
        ) : null}
        <div>{children}</div>
      </div>
    ),
  }),

  Carousel: block({
    label: 'Carousel',
    description: 'Image carousel. The actual slides are defined by image URLs in the component props.',
    schema: {
      images: fields.array(
        fields.object({
          src: fields.text({ label: 'Image path (relative or absolute)' }),
          alt: fields.text({ label: 'Alt text' }),
        }),
        {
          label: 'Images',
          itemLabel: (p) => p.fields.alt.value || p.fields.src.value || 'Image',
        },
      ),
      height: fields.select({
        label: 'Height',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra large', value: 'xl' },
          { label: 'Auto', value: 'auto' },
        ],
        defaultValue: 'md',
      }),
      autoScroll: fields.checkbox({ label: 'Auto-scroll', defaultValue: false }),
      autoScrollInterval: fields.integer({ label: 'Auto-scroll interval (ms)', defaultValue: 5000 }),
      showArrows: fields.checkbox({ label: 'Show arrow buttons', defaultValue: true }),
      showDots: fields.checkbox({ label: 'Show dot indicators', defaultValue: true }),
    },
    ContentView: ({ value }) => (
      <div style={box}>
        <div style={label}>Carousel</div>
        <NotEditable>
          <span>{value.images.length} image{value.images.length === 1 ? '' : 's'} · height: {value.height}</span>
        </NotEditable>
      </div>
    ),
  }),

  Center: wrapper({
    label: 'Center',
    description: 'Centers its children horizontally.',
    schema: {},
    ContentView: ({ children }) => (
      <div style={{ ...box, textAlign: 'center' }}>
        <div style={label}>Center</div>
        <div>{children}</div>
      </div>
    ),
  }),

  Instagram: block({
    label: 'Instagram embed',
    description: 'Embeds an Instagram post by URL.',
    schema: {
      url: fields.text({
        label: 'Instagram post URL',
        description: 'Full URL (https://www.instagram.com/p/…) or just the shortcode.',
        validation: { isRequired: true },
      }),
      size: fields.select({
        label: 'Size',
        description: 'Max width of the embed card on desktop.',
        options: [
          { label: 'Small (380px)', value: 'small' },
          { label: 'Medium (460px)', value: 'medium' },
          { label: 'Large (540px)', value: 'large' },
          { label: 'Full width (100%)', value: 'full' },
        ],
        defaultValue: 'medium',
      }),
    },
    ContentView: ({ value }) => (
      <div style={box}>
        <div style={label}>Instagram — {value.size}</div>
        <NotEditable>
          <code style={{ fontSize: 12 }}>{value.url || '(no url)'}</code>
        </NotEditable>
      </div>
    ),
  }),

  Marquee: wrapper({
    label: 'Marquee',
    description: 'Horizontally scrolling row of content (logos, images, etc).',
    schema: {
      height: fields.select({
        label: 'Height',
        description: 'Vertical size of the marquee strip.',
        options: [
          { label: 'Small (12rem)', value: 'sm' },
          { label: 'Medium (16rem)', value: 'md' },
          { label: 'Large (20rem)', value: 'lg' },
          { label: 'Extra large (24rem)', value: 'xl' },
        ],
        defaultValue: 'md',
      }),
      direction: fields.select({
        label: 'Scroll direction',
        options: [
          { label: 'Left ← (default)', value: 'left' },
          { label: 'Right →', value: 'right' },
        ],
        defaultValue: 'left',
      }),
      speed: fields.integer({
        label: 'Speed (pixels per second)',
        description: 'Higher = faster scroll. Default 50.',
        defaultValue: 50,
      }),
      gap: fields.text({
        label: 'Gap between items',
        description: 'Any valid CSS length (e.g. 1rem, 24px). Default 2rem.',
        defaultValue: '2rem',
      }),
      pauseOnHover: fields.checkbox({
        label: 'Pause on hover',
        description: 'Desktop only — hovering the strip stops the scroll.',
        defaultValue: true,
      }),
    },
    ContentView: ({ value, children }) => (
      <div style={box}>
        <div style={label}>
          Marquee — {value.height} | {value.direction === 'right' ? 'right →' : 'left ←'} | {value.speed}px/s
        </div>
        <div>{children}</div>
      </div>
    ),
  }),

  YouTube: block({
    label: 'YouTube video',
    description: 'Embeds a YouTube video by ID or URL.',
    schema: {
      id: fields.text({ label: 'YouTube video ID or URL', validation: { isRequired: true } }),
      title: fields.text({ label: 'Title (accessibility)', defaultValue: 'YouTube video' }),
      width: fields.text({ label: 'Width (CSS)', defaultValue: '100%' }),
    },
    ContentView: ({ value }) => (
      <div style={box}>
        <div style={label}>YouTube</div>
        <NotEditable>
          <code style={{ fontSize: 12 }}>{value.id || '(no id)'}</code>
        </NotEditable>
      </div>
    ),
  }),

  Preview: wrapper({
    label: 'Preview',
    description:
      'Live rendering of one or more components, without prose styling. Used in docs to show what a component looks like next to its code example.',
    schema: {
      layout: fields.select({
        label: 'Layout',
        options: [
          { label: 'Stack (default)', value: 'stack' },
          { label: 'Row', value: 'row' },
          { label: 'Row — center-aligned', value: 'row-center' },
        ],
        defaultValue: 'stack',
      }),
      spacing: fields.select({
        label: 'Spacing',
        options: [
          { label: 'Compact (mb-4)', value: 'compact' },
          { label: 'Normal (my-6)', value: 'normal' },
        ],
        defaultValue: 'compact',
      }),
    },
    ContentView: ({ children }) => (
      <div style={{ ...box, borderStyle: 'solid', opacity: 0.9 }}>
        <div style={label}>Preview</div>
        <div>{children}</div>
      </div>
    ),
  }),

  SideBySide: repeating({
    label: 'Side-by-side layout',
    description: 'Two columns that stack on mobile. Insert one Left and one Right child.',
    children: ['Left', 'Right'],
    validation: { children: { min: 0, max: 2 } },
    schema: {
      showDivider: fields.checkbox({ label: 'Show divider', defaultValue: true }),
    },
    ContentView: ({ children }) => (
      <div style={box}>
        <div style={label}>Side-by-side</div>
        <div style={{ display: 'flex', gap: '1rem' }}>{children}</div>
      </div>
    ),
  }),

  Left: wrapper({
    label: 'Left column',
    description: 'Left column of a SideBySide layout.',
    schema: {
      centerVertical: fields.checkbox({ label: 'Center vertically', defaultValue: false }),
    },
    ContentView: ({ children }) => (
      <div style={{ ...box, flex: 1 }}>
        <div style={label}>Left</div>
        <div>{children}</div>
      </div>
    ),
  }),

  Right: wrapper({
    label: 'Right column',
    description: 'Right column of a SideBySide layout.',
    schema: {
      centerVertical: fields.checkbox({ label: 'Center vertically', defaultValue: false }),
    },
    ContentView: ({ children }) => (
      <div style={{ ...box, flex: 1 }}>
        <div style={label}>Right</div>
        <div>{children}</div>
      </div>
    ),
  }),
};

export function buildMdxComponents(opts: MdxComponentsOptions = {}) {
  return {
    ...sharedBlocks,
    Img: makeImgBlock(opts.imageRoot),
  };
}

// Back-compat default: text-based Img, same as before the factory landed.
export const mdxComponents = buildMdxComponents();

// Silence unused-import warning for `mark` — kept in the import list in case
// future components need it.
void mark;
