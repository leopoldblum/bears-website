---
title: "Anchor IDs Reference"
description: "Complete list of anchor IDs on every page, for deep-linking to specific sections."
order: 28
group: "Content"
---

Every major section and heading on the site has an `id` attribute, so you can link directly to it using a hash fragment. For example, linking to `/about-us#find-us-section` scrolls straight to the "Find Us" section on the About page.

All anchored elements use `scroll-mt-20` so the target appears with breathing room below the navbar.

## How to use

In any content file that accepts an `href` (buttons, CTAs, footer navigation, crosslinks), use the format:

```
/page-path#anchor-id
```

For example:

```yaml
buttonHref: "/about-us#find-us-section"
```

Within the same page, just use the fragment:

```yaml
href: "#faq-title"
```

---

## Homepage (`/`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `hero` | section | Landing hero &mdash; media carousel, logo, and CTA cards | [/#hero](/#hero) |
| `what-is-bears-section` | section | "What is BEARS" intro with image marquee | [/#what-is-bears-section](/#what-is-bears-section) |
| `meet-the-team-section` | section | Project showcase with team accordion | [/#meet-the-team-section](/#meet-the-team-section) |
| `our-sponsors-section` | section | Sponsor logos by tier | [/#our-sponsors-section](/#our-sponsors-section) |
| `testimonials-section` | section | Testimonials carousel | [/#testimonials-section](/#testimonials-section) |
| `latest-news-section` | section | Latest news grid (events + projects) | [/#latest-news-section](/#latest-news-section) |
| `latest-news` | h2 | "Latest News" heading | [/#latest-news](/#latest-news) |

## About Us (`/about-us`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/about-us#page-hero](/about-us#page-hero) |
| `page-title` | h1 | Page title inside hero | [/about-us#page-title](/about-us#page-title) |
| `our-mission-section` | section | Mission statement with image | [/about-us#our-mission-section](/about-us#our-mission-section) |
| `whats-in-it` | h3 | "What's in it" benefits grid | [/about-us#whats-in-it](/about-us#whats-in-it) |
| `faces-of-bears-title` | h2 | Faces of BEARS team members heading | [/about-us#faces-of-bears-title](/about-us#faces-of-bears-title) |
| `find-us-section` | section | Location, room, schedule, and map | [/about-us#find-us-section](/about-us#find-us-section) |
| `find-us-map` | div | Interactive Leaflet map | [/about-us#find-us-map](/about-us#find-us-map) |
| `faq-title` | h2 | FAQ heading | [/about-us#faq-title](/about-us#faq-title) |

## Events (`/events`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/events#page-hero](/events#page-hero) |
| `page-title` | h1 | Page title inside hero | [/events#page-title](/events#page-title) |
| `whats-happening` | div | Events grid with filters and sort | [/events#whats-happening](/events#whats-happening) |

## Projects (`/projects`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/projects#page-hero](/projects#page-hero) |
| `page-title` | h1 | Page title inside hero | [/projects#page-title](/projects#page-title) |
| `what-we-build` | div | Projects grid with filters and sort | [/projects#what-we-build](/projects#what-we-build) |

## Sponsors (`/sponsors`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/sponsors#page-hero](/sponsors#page-hero) |
| `page-title` | h1 | Page title inside hero | [/sponsors#page-title](/sponsors#page-title) |
| `sponsor-showcase` | section | All sponsor tiers (accordion layout) | [/sponsors#sponsor-showcase](/sponsors#sponsor-showcase) |
| `diamond` | div | Diamond tier sponsors | [/sponsors#diamond](/sponsors#diamond) |
| `platinum` | div | Platinum tier sponsors | [/sponsors#platinum](/sponsors#platinum) |
| `gold` | div | Gold tier sponsors | [/sponsors#gold](/sponsors#gold) |
| `silver` | div | Silver tier sponsors | [/sponsors#silver](/sponsors#silver) |
| `bronze` | div | Bronze tier sponsors | [/sponsors#bronze](/sponsors#bronze) |
| `become-a-sponsor-title` | h2 | "Become a Sponsor" CTA heading | [/sponsors#become-a-sponsor-title](/sponsors#become-a-sponsor-title) |

## Contact (`/contact`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/contact#page-hero](/contact#page-hero) |
| `page-title` | h1 | Page title inside hero | [/contact#page-title](/contact#page-title) |
| `contact-info` | section | Contact cards section | [/contact#contact-info](/contact#contact-info) |
| `contact-email` | h3 | Email card | [/contact#contact-email](/contact#contact-email) |
| `contact-social` | h3 | Social media card | [/contact#contact-social](/contact#contact-social) |
| `contact-address` | h3 | Address card | [/contact#contact-address](/contact#contact-address) |

## Media (`/media`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `page-hero` | section | Hero image banner | [/media#page-hero](/media#page-hero) |
| `page-title` | h1 | Page title inside hero | [/media#page-title](/media#page-title) |
| `media-all` | div | "All" images accordion | [/media#media-all](/media#media-all) |
| `media-all-title` | h3 | "All" heading | [/media#media-all-title](/media#media-all-title) |
| `media-events` | div | Events images accordion | [/media#media-events](/media#media-events) |
| `media-events-title` | h3 | "Events" heading | [/media#media-events-title](/media#media-events-title) |
| `media-projects` | div | Projects images accordion | [/media#media-projects](/media#media-projects) |
| `media-projects-title` | h3 | "Projects" heading | [/media#media-projects-title](/media#media-projects-title) |
| `media-what-is-bears` | div | "What is BEARS" images accordion | [/media#media-what-is-bears](/media#media-what-is-bears) |
| `media-what-is-bears-title` | h3 | "What is BEARS" heading | [/media#media-what-is-bears-title](/media#media-what-is-bears-title) |
| `media-team--testimonials` | div | Team & Testimonials images accordion | [/media#media-team--testimonials](/media#media-team--testimonials) |
| `media-team--testimonials-title` | h3 | "Team & Testimonials" heading | [/media#media-team--testimonials-title](/media#media-team--testimonials-title) |

## Imprint (`/imprint`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `imprint` | h1 | Page title | [/imprint#imprint](/imprint#imprint) |

## Datenschutz (`/datenschutz`)

| Anchor ID | Element | Description | Link |
|---|---|---|---|
| `datenschutz` | h1 | Page title | [/datenschutz#datenschutz](/datenschutz#datenschutz) |

---

## Common deep-link examples

These are some frequently used anchor links across the site:

| Link | Used in |
|---|---|
| [/about-us#find-us-section](/about-us#find-us-section) | Hero CTA "How to Join", contact crosslink, footer |
| [/about-us#faces-of-bears-title](/about-us#faces-of-bears-title) | Footer "Our Team" link |
| [/about-us#faq-title](/about-us#faq-title) | Footer "FAQ" link |
| [/sponsors#become-a-sponsor-title](/sponsors#become-a-sponsor-title) | Footer "Become a Sponsor" link |
| [/events?date=upcoming#whats-happening](/events?date=upcoming#whats-happening) | Footer "Upcoming Events" (filter + anchor) |
| [/projects?status=ongoing#what-we-build](/projects?status=ongoing#what-we-build) | Footer "Current Projects" (filter + anchor) |
| [/sponsors#diamond](/sponsors#diamond) | Footer "Our Partners" link |
