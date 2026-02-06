# Managing Page Content

This guide explains how to edit the text content displayed on the website's pages — headings, descriptions, buttons, and body text.

## Where to Find Content Files

All page content files live in `src/content/pageContent/`, organized by page:

```
src/content/pageContent/
├── landing-page/              <- Sections on the main homepage
│   ├── hero-ctas.md           <- Call-to-action cards on the hero
│   ├── what-is-bears.md       <- "What is BEARS e.V.?" section
│   ├── meet-the-team.md       <- "Meet the Team" heading
│   ├── become-sponsor.md      <- "Become a Sponsor" section
│   ├── latest-news.md         <- "Latest News" section
│   └── testimonials.md        <- "What Members Think" heading
├── about-us/                  <- About Us page
│   ├── about-us-title.md      <- Page title + subtitle
│   ├── our-mission.md         <- "Our Mission" section
│   ├── whats-in-it.md         <- "What's in it for you?" list
│   ├── faces-of-bears.md      <- Photo gallery section
│   └── find-us.md             <- Location + schedule section
├── events/                    <- Events page
│   └── events-title.md        <- Page title + subtitle
├── media/                     <- Media page
│   └── media-title.md         <- Page title + subtitle
├── projects/                  <- Projects page
│   └── projects-title.md      <- Page title + subtitle
└── sponsors/                  <- Sponsors page
    └── sponsors-title.md      <- Page title + subtitle + body
```

## Editing a Homepage Section

Homepage sections like "What is BEARS e.V.?" have these fields:

```yaml
---
title: "What is BEARS e.V.?"
description: "Your description text here..."
buttonText: "Learn More"
buttonHref: "/about-us"
---
```

| Field | Required? | What it does |
|---|---|---|
| `title` | Yes | The section heading |
| `description` | No | The paragraph text below the heading |
| `buttonText` | No | Text shown on the button |
| `buttonHref` | No | Where the button links to (e.g., `/about-us`) |

**To hide the button:** Remove both `buttonText` and `buttonHref` lines.

**To hide the description:** Remove the `description` line.

## Editing the Hero Call-to-Action Cards

The hero section at the top of the homepage can display 0 to 4 cards. Edit `landing-page/hero-ctas.md`:

```yaml
---
title: "Hero Cards"
ctas:
  - title: "How to Join"
    description: "Becoming a member of Bears e.V."
    href: "/about-us"
  - title: "Our Projects"
    description: "Explore what we are working on"
    href: "/projects"
  - title: "Events"
    description: "Upcoming workshops and meetups"
    href: "/events"
---
```

**To add a card:** Add another item under `ctas:` (maximum 4 cards).

**To remove a card:** Delete the 3 lines for that card (title, description, href).

**To show no cards:** Remove all items under `ctas:` or remove the `ctas:` field entirely.

## Editing a Page Header

Pages like Events and Projects have a title and subtitle. Edit the `-title.md` file in the page's folder:

```yaml
---
title: "Events"
subtitle: "Join us for workshops, hackathons, and networking opportunities"
---
```

| Field | Required? | What it does |
|---|---|---|
| `title` | Yes | The page title (shown in the hero and browser tab) |
| `subtitle` | No | The text below the title in the hero section |

## Editing a Full Page (About Us, Sponsors)

Some pages have rich body content in addition to the title and subtitle. Write your content below the `---` using Markdown formatting:

```markdown
---
title: "Who are we?"
subtitle: "Learn about our mission, values, and the passionate students behind BEARS"
---

# Our Mission

BEARS is a student organization dedicated to aerospace research...

## What We Do

- Design and build satellites
- Participate in international competitions
- Host workshops and lectures

**Contact us** at [email@example.com](mailto:email@example.com) for more information.
```

You can use any Markdown formatting: headings, bold, italic, lists, links, etc.

## Editing Images

Images are managed separately from text content. To change images:

| Image | Where to edit |
|---|---|
| "What is BEARS" marquee | Add/remove files in `src/assets/whatIsBears/` |
| Event cover images | Add/remove files in `src/assets/events/` |
| Project cover images | Add/remove files in `src/assets/projects/` |
| Sponsor logos | See [Managing Sponsors](managing-sponsors.md) |
| Testimonial portraits | See [Managing Testimonials](managing-testimonials.md) |
| Hero backgrounds | See the `landingHero` content collection |

## Tips

- Always keep the `---` markers (frontmatter delimiters) at the top of each file
- Field values with special characters should be wrapped in quotes: `title: "What is BEARS e.V.?"`
- The website will automatically rebuild when you save changes (in development mode)
- If you see a build error, check that your YAML formatting is correct (proper indentation, no missing quotes)
