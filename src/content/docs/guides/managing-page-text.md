---
title: "Managing Page Text"
description: "How to edit headings, descriptions, CTAs, and other page copy."
order: 27
group: "Content"
---

Page text files let you edit headings, descriptions, buttons, and other copy across the website without touching code. They are stored in `src/content/page-text/`.

## How It Works

Each `.md` file provides text for a specific section of a page. You only edit the **frontmatter** (the YAML between the `---` lines) &mdash; the body of these files is not used.

When a page loads, its component fetches the matching content file by ID and renders the fields into the page. If a file is missing or a field is left out, the section will either hide that element or fall back to a default &mdash; nothing will break.

## Folder Structure

Files are organized by **locale**, then by **page**. Each locale subfolder (`en/` and `de/`) has the same internal structure:

```
src/content/page-text/
├── en/                ← English (default)
│   ├── landing/       — Homepage sections (hero, intro, testimonials, etc.)
│   ├── about-us/      — About Us page (mission, benefits, FAQ, etc.)
│   ├── events/        — Events page (header, intro, crosslinks)
│   ├── projects/      — Projects page (header, categories, crosslinks)
│   ├── sponsors/      — Sponsors page (header, tiers, CTA)
│   ├── contact/       — Contact page
│   ├── media/         — Media page
│   ├── header/        — Header (navigation links)
│   ├── footer/        — Footer (navigation, address, legal)
│   ├── site/          — Site-wide settings (metadata, social links)
│   ├── 404/           — Not Found page
│   ├── imprint/       — Imprint page
│   └── datenschutz/   — Privacy policy page
└── de/                ← German translations (same structure as en/)
    ├── landing/
    ├── about-us/
    └── ...
```

Both `en/` and `de/` folders use identical filenames. If a German translation is missing, the English version is shown automatically on `/de/` pages.

**Naming conventions:**
- Page hero/header files end in `-title` (e.g., `events/events-title`, `about-us/about-us-title`)
- Crosslink sections end in `-crosslink` (e.g., `events/events-crosslink`, `projects/projects-crosslink`)
- Empty-state messages end in `-empty-state` (e.g., `events/events-empty-state`)
- Other files are named after the section they control (e.g., `about-us/our-mission`, `about-us/faq`)

## Available Fields

Every file must have a `title`. All other fields are optional &mdash; each file uses only the fields its section needs.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string **(required)** | Section heading |
| `subtitle` | string | Secondary heading, label, or tagline displayed above or below the title |
| `description` | string | Paragraph text (intro copy, explanations) |
| `seoDescription` | string | Meta description for search engines (~150 characters) |
| `buttonText` | string | Primary button label (pair with `buttonHref`) |
| `buttonHref` | string | Primary button link URL (pair with `buttonText`) |
| `secondButtonText` | string | Secondary button label (pair with `secondButtonHref`) |
| `secondButtonHref` | string | Secondary button link URL (pair with `secondButtonText`) |
| `instagramButtonText` | string | Label for the "Follow us on Instagram" button |
| `ctas` | array | Call-to-action cards (max 4), each with `title`, `description`, `href` |
| `items` | array | List of strings (for addresses, benefits, tiers &mdash; see below) |
| `faqs` | array | FAQ entries, each with `question` and `answer` (answers support Markdown) |
| `socialLinks` | array | Social media links, each with `platform`, `url`, optional `hoverColor` |
| `navLinks` | array | Simple navigation links, each with `label` and `href` |
| `navColumns` | array | Multi-column navigation, each with `heading`, `href`, and nested `links` |

## Patterns &amp; Examples

Below is every type of content file used on the site, with a full example and explanation of where it appears.

---

### Page Hero Header

Controls the main title and subtitle at the top of a page. Most pages have one of these. Include `seoDescription` to set the page's `<meta name="description">` tag for search engines.

```yaml
---
title: "Events"
subtitle: "Join us for workshops, hackathons, and networking opportunities"
seoDescription: "Upcoming BEARS events and workshops at TU Berlin."
---
```

**Where it appears:** The large heading and subtitle shown at the very top of a page.

**Fields used:** `title`, `subtitle`, `seoDescription`

**Files:** `events/events-title`, `projects/projects-title`, `sponsors/sponsors-title`, `about-us/about-us-title`, `media/media-title`, `contact/contact-title`

---

### Heading + Description + Button

The most common pattern. Used for section introductions and crosslinks that direct visitors to another page.

```yaml
---
title: "What is BEARS e.V.?"
description: "We are a student team at TU Berlin building rockets, satellites, and more. Our members gain hands-on experience in aerospace engineering."
buttonText: "Learn More"
buttonHref: "/about-us"
---
```

**Where it appears:** Standalone sections on the homepage, intro paragraphs on content pages, and crosslink banners at the bottom of pages ("Want to see our projects? &rarr;").

**Fields used:** `title`, `description` (optional), `buttonText` + `buttonHref` (optional, always used as a pair), `secondButtonText` + `secondButtonHref` (optional second button, used in `landing/latest-news`), `instagramButtonText` (optional, only in `landing/latest-news`)

**Files:** `landing/what-is-bears`, `landing/latest-news`, `landing/become-sponsor`, `events/events-intro`, `events/events-crosslink`, `projects/projects-crosslink`, `sponsors/sponsors-intro`, `sponsors/sponsors-crosslink`, `sponsors/become-sponsor-cta`

---

### Subtitle + Title + Description (Mission Statement)

Some sections display a small label above the main heading for visual hierarchy. The `subtitle` field serves as this label.

```yaml
---
title: "Our Mission"
subtitle: "This is"
description: "We bridge the gap between the classroom and the launchpad. At BEARS, students design, build, and launch real aerospace systems — from sounding rockets to scientific payloads."
---
```

**Where it appears:** The "Our Mission" section on the About Us page. The subtitle renders as a small accented label above the title (e.g., "<span style="color: var(--bears-accent);">THIS IS</span> Our Mission").

**Fields used:** `subtitle`, `title`, `description`

**Files:** `about-us/our-mission`, `landing/testimonials`

---

### Items List (Simple Strings)

A plain list of strings, useful for addresses, short content blocks, or any ordered set of text lines.

```yaml
---
title: "BEARS"
items:
  - "Berlin Experimental Astronautics"
  - "Research Student team e.V."
  - "c/o TU Berlin - Institut für Luft- und Raumfahrt"
  - "Marchstraße 12-14"
  - "10587 Berlin"
---
```

**Where it appears:** The footer address block and contact information. Each item is rendered as a separate line.

**Fields used:** `title`, `items`

**Files:** `footer/footer-address`, `contact/contact-info`

---

### Items List (Title + Description with Arrow Separator)

A richer list format where each item contains a title and a description, separated by ` -> `. The component splits these into two parts for styled rendering (bold title + lighter description).

```yaml
---
title: "What's in it for you?"
items:
  - "Hands-on Engineering -> Design, manufacture, and test real rocket systems — from propulsion to avionics and recovery."
  - "Industry Connections -> Build your network through partnerships with aerospace companies and research institutions."
  - "Team Leadership -> Take ownership of subsystems and lead cross-functional teams on ambitious projects."
  - "Competition Experience -> Represent TU Berlin at international rocketry competitions and technical challenges."
  - "Research Opportunities -> Contribute to cutting-edge aerospace research alongside experienced engineers."
  - "Community & Friends -> Join a tight-knit group of passionate students who share your curiosity about space."
  - "Professional Growth -> Develop project management, documentation, and presentation skills."
---
```

**Where it appears:** The "What's in it for you?" benefits grid on the About Us page. Each item becomes a card with a numbered label, a bold title, and a description.

**Important:** The ` -> ` separator (space-arrow-space) is significant. Everything before it becomes the card title; everything after becomes the description. If you omit the ` -> `, the entire string is used as the title with no description.

**Fields used:** `title`, `items`

**Files:** `about-us/whats-in-it`, `sponsors/sponsor-tiers`

---

### FAQs

Expandable question-and-answer sections rendered as an accordion. Answers support **Markdown** formatting, so you can use bold text, links, and lists inside them.

```yaml
---
title: "Frequently Asked Questions"
subtitle: "Got Questions?"
description: "Everything you need to know about joining and participating in BEARS e.V."
buttonText: "Get in touch"
buttonHref: "/contact"
faqs:
  - question: "How can I join BEARS e.V.?"
    answer: "Just show up to one of our weekly meetings! We welcome all TU Berlin students, regardless of their field of study or experience level. Check the **Find Us** section above for our meeting time and location."
  - question: "Do I need prior aerospace experience?"
    answer: "Not at all! Our members come from diverse backgrounds — mechanical engineering, computer science, physics, and more. We provide training and mentoring so you can learn as you go."
  - question: "Are there membership fees?"
    answer: "BEARS e.V. charges a small annual membership fee to cover materials and operational costs. Financial constraints should never prevent you from joining — reach out to us if you have concerns."
  - question: "How can my company sponsor BEARS?"
    answer: "We are always looking for sponsors! Visit our [Sponsors page](/sponsors) or [get in touch](/contact) directly to discuss partnership opportunities."
---
```

**Where it appears:** The FAQ section on the About Us page. Each FAQ becomes a collapsible accordion item. The `buttonText`/`buttonHref` creates a "Still have questions?" link below the accordion.

**Markdown in answers:** You can use:
- `**bold text**` for emphasis
- `[link text](/path)` for internal links
- `[link text](https://example.com)` for external links
- `- item` for bullet lists

**Fields used:** `title`, `subtitle` (optional label above heading), `description` (optional intro text), `buttonText` + `buttonHref` (optional CTA link), `faqs`

**Files:** `about-us/faq`

---

### CTA Cards (Hero)

The homepage hero section displays up to 4 call-to-action cards. Each card has a title, a short description, and a link. The `subtitle` field sets the tagline displayed below the BEARS logo.

```yaml
---
title: "Hero Cards"
subtitle: "Berlin Experimental Astronautics Research Student Team e.V."
seoDescription: "BEARS e.V. – Student aerospace team at TU Berlin building rockets, satellites, and more."
ctas:
  - title: "How to Join"
    description: "Becoming a member of Bears e.V."
    href: "/about-us#find-us-section"
  - title: "Our Projects"
    description: "Explore what we are working on"
    href: "/projects"
  - title: "Events"
    description: "Upcoming workshops and meetups"
    href: "/events"
  - title: "Contact Us"
    description: "Get in touch with the team"
    href: "/contact"
---
```

**Where it appears:** The animated hero section on the homepage. Each CTA becomes a glass-style card with a hover glow effect.

**Important:** You can have between 0 and 4 CTA cards. The grid layout adjusts automatically. If you remove all CTAs, only the logo and subtitle are shown.

**Link paths:** Always write `href` values **without** a `/de/` prefix (e.g., `/projects`, not `/de/projects`). The code automatically adds the correct locale prefix when rendering the German version of the page.

**Fields used:** `title` (not displayed, used internally), `subtitle` (hero tagline), `seoDescription` (homepage meta description), `ctas` (each with `title`, `description`, `href`)

**Files:** `landing/hero`

---

### Social Media Links

The single source of truth for all social media links across the website. This file is used by the Footer, Contact page, LatestNews section (Instagram CTA), and the structured data (`schema.org` Organization `sameAs`).

Each entry specifies a `platform` name (which determines the icon) and a `url`. You can optionally set a custom `hoverColor` per platform.

```yaml
---
title: "Social Links"
socialLinks:
  - platform: "instagram"
    url: "https://www.instagram.com/bears.space/"
  - platform: "linkedin"
    url: "https://www.linkedin.com/company/bears-ev/"
    hoverColor: "#0A66C2"
  - platform: "youtube"
    url: "https://www.youtube.com/@BEARS-Space"
---
```

**Where it appears:** The social media icon row in the Footer and Contact page, the Instagram CTA link on the homepage, and the `sameAs` array in structured data.

**Supported platforms:** `instagram`, `linkedin`, `youtube`. Icons are mapped by platform name in `src/utils/socialIcons.ts`. To add a new platform, add an entry here **and** add its SVG icon path in that file. The SVG path data for a new platform icon can easily be generated by an AI — just ask it for a 24&times;24 single-path SVG of the platform's logo.

**`hoverColor`:** Optional. Sets a custom color when hovering over the icon. If omitted, the default accent color is used. Use standard hex color codes (e.g., `"#0A66C2"` for LinkedIn blue).

**Fields used:** `title` (not displayed), `socialLinks`

**Files:** `site/social-links`

---

### Header Navigation

Controls the top navigation bar links shown on every page. Each entry has a `label` (displayed text) and an `href` (link target).

```yaml
---
title: "Header Navigation"
navLinks:
  - label: "Projects"
    href: "/projects"
  - label: "Sponsors"
    href: "/sponsors"
  - label: "Events"
    href: "/events"
  - label: "About Us"
    href: "/about-us"
  - label: "Contact"
    href: "/contact"
---
```

**Where it appears:** The main navigation bar at the top of every page (desktop menu and mobile hamburger menu).

**Reordering or removing links:** The links appear in the order listed. Remove an entry to hide it from the nav, or rearrange entries to change the order.

**Fields used:** `title` (not displayed), `navLinks` (each with `label` and `href`)

**Files:** `header/navigation`

---

### Footer Navigation (Multi-Column)

Defines the footer's multi-column link layout. Each column has a heading (which is also a link), and a list of sub-links beneath it.

```yaml
---
title: "Footer Navigation"
navColumns:
  - heading: "Projects"
    href: "/projects"
    links:
      - label: "Current Projects"
        href: "/projects?status=ongoing#what-we-build"
      - label: "Experimental Rocketry"
        href: "/projects?category=experimental-rocketry#what-we-build"
      - label: "Past Projects"
        href: "/projects?status=completed#what-we-build"
  - heading: "Events"
    href: "/events"
    links:
      - label: "Upcoming Events"
        href: "/events?date=upcoming#whats-happening"
      - label: "Past Events"
        href: "/events?date=past#whats-happening"
  - heading: "About Us"
    href: "/about-us"
    links:
      - label: "Our Team"
        href: "/about-us#faces-of-bears-title"
      - label: "Media"
        href: "/media"
      - label: "Contact"
        href: "/contact"
      - label: "FAQ"
        href: "/about-us#faq-title"
---
```

**Where it appears:** The multi-column navigation grid in the footer.

**Link format:** Links can include query parameters and hash fragments to deep-link to filtered views or specific sections (e.g., `/events?date=upcoming#whats-happening`).

**Fields used:** `title` (not displayed), `navColumns` (each with `heading`, `href`, and `links` array of `label` + `href`)

**Files:** `footer/navigation`

---

### Bottom Bar (Copyright + Legal Links)

Controls the copyright text and legal page links at the very bottom of the footer.

```yaml
---
title: "© {year} BEARS e.V. All rights reserved."
navLinks:
  - label: "Imprint"
    href: "/imprint"
  - label: "Privacy Policy"
    href: "/datenschutz"
---
```

**Where it appears:** The thin bar at the bottom of every page.

**`{year}` placeholder:** The `title` field supports a `{year}` placeholder that is automatically replaced with the current year at build time. Write it exactly as `{year}`.

**Fields used:** `title` (copyright text with optional `{year}` placeholder), `navLinks` (legal page links)

**Files:** `footer/bottom-bar`

---

### Site Metadata

Sets the default site title and description used in `<title>` tags and as fallback meta descriptions across the site.

```yaml
---
title: "BEARS e.V."
description: "BEARS e.V. – Berlin Experimental Astronautics Research Student team at TU Berlin. Building rockets, satellites, and more."
---
```

**Where it appears:** The browser tab title and default meta description when a page does not provide its own `seoDescription`.

**Fields used:** `title`, `description`

**Files:** `site/metadata`

---

### Empty States

Shown when a content list (events, projects) has no items to display. Provides a friendly message instead of a blank page.

```yaml
---
title: "No events right now"
description: "Check back soon — we're always planning something new!"
---
```

**Where it appears:** The events or projects page when there are no entries matching the current filter.

**Fields used:** `title`, `description`

**Files:** `events/events-empty-state`, `projects/projects-empty-state`

---

### Media Categories

Controls which image categories appear on the Media page, their display order, and their labels. Each entry has an `id` (matching a known image directory) and a `label` (the displayed title).

```yaml
---
title: "Media"
subtitle: "Browse our photo gallery"
seoDescription: "Photos from BEARS events, projects, and team activities."
mediaCategories:
  - id: all
    label: "All"
  - id: events
    label: "Events"
  - id: projects
    label: "Projects"
  - id: what-is-bears
    label: "What is BEARS"
---
```

**Where it appears:** The Media page. Each category becomes a collapsible accordion section showing images from that directory.

**Available IDs:**

| ID | Images from |
|----|-------------|
| `all` | Combined images from all other listed categories (special) |
| `about-us` | About Us page images (`src/assets/about-us/our-mission/`) |
| `events` | Event cover images (`src/assets/events/`) |
| `faces-of-bears` | Faces of BEARS portraits (`src/assets/faces-of-bears/`) |
| `hero` | All hero images across pages (`src/assets/hero/`) |
| `projects` | Project cover images (`src/assets/projects/`) |
| `team-members` | Team member portraits (`src/assets/projects/team-members/`) |
| `testimonials` | Testimonial portraits (`src/assets/testimonials/`) |
| `what-is-bears` | What is BEARS images (`src/assets/whatIsBears/`) |

**Controlling the page:**
- **Show/hide categories:** Add or remove entries from the list. Only listed categories appear.
- **Reorder categories:** The display order matches the list order in the file.
- **Rename categories:** Change the `label` to set the displayed title (this is translated per locale).
- **"All" category:** When `all` is in the list, it combines images from all other listed categories. Remove it to hide the combined view.
- Categories with no images are automatically hidden.

**Fields used:** `title`, `subtitle`, `seoDescription`, `mediaCategories`

**Files:** `media/media-title`

---

### Category Descriptions (Projects)

Each project category can have its own introductory text, shown on the Projects page below the category heading. The heading itself is derived automatically from the category enum label (via `getCategoryLabel` in `src/utils/i18n.ts`), so it does not need to be set here.

```yaml
---
title: "Experimental Rocketry"
description: "From design to launch — building and testing real sounding rockets, hybrid engines, and recovery systems."
---
```

**Where it appears:** The Projects page category filter section, as a short description under each category heading. The `title` is required by the schema but not displayed &mdash; the visible heading is derived from the category enum label.

**Fields used:** `title` (required, not displayed), `description`

**Files:** `projects/category-experimental-rocketry`, `projects/category-science-and-experiments`, `projects/category-robotics`

---

## Tips

- **`title` is required.** Every page-text file must have a `title` field. All other fields are optional &mdash; the component will skip missing fields or use a sensible default.
- **`buttonText` and `buttonHref` go together.** If you provide one without the other, the build will fail with a validation error. The same applies to `secondButtonText` and `secondButtonHref` for the optional secondary button.
- **`seoDescription` matters for search engines.** Keep it around 150 characters. It appears in Google search results and social media previews. Only page header files (the `-title` files) typically need this field.
- **FAQ answers support Markdown.** Use `**bold**`, `[link text](/path)`, and `- bullet items` to format answers.
- **The ` -> ` separator in items is optional.** Without it, items render as simple strings. With it, the text splits into a title and description.
- **The `{year}` placeholder** in the copyright text is the only dynamic template supported. It is replaced with the current year at build time.
- **To find which file controls a section**, look at the page's subfolder. For example, all About Us content is in `about-us/`, all footer content is in `footer/`.
- **Adding or removing CTA cards** on the hero automatically adjusts the grid layout (1–4 columns). You can also set `ctas` to an empty list to show no cards.
- **All `href` values must be locale-neutral** &mdash; always write paths without a `/de/` prefix (e.g., `/projects`, `/about-us#find-us-section`). The website automatically adds the correct locale prefix when rendering the German version. This applies to `buttonHref`, `secondButtonHref`, `ctas[].href`, `navLinks[].href`, and `navColumns` links. Writing `/de/projects` would result in a broken double-prefix (`/de/de/projects`).
