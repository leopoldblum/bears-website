# Managing Instagram Posts

This guide covers how to add Instagram posts to the website. Posts appear on the homepage in the "Follow Us on Instagram" section and can also be embedded in any content page.

## Adding a New Post

1. Create a new `.md` file in `src/content/instagram/`
2. Name it using the format `YYYY-MM-DD-slug.md` (e.g., `2026-01-15-workshop-recap.md`)
3. Add the required frontmatter

### Template

```markdown
---
url: "https://www.instagram.com/p/YOUR_POST_ID/"
date: 2026-01-15
---
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Full Instagram post URL (supports `/p/`, `/reel/`, `/tv/`) |
| `date` | Yes | Publication date in `YYYY-MM-DD` format, used for sorting (newest first) |
| `isDraft` | No | Set to `true` to hide from production (visible in dev mode) |

### Finding the Post URL

1. Open the Instagram post in your browser
2. Copy the URL from the address bar (e.g., `https://www.instagram.com/p/ABC123xyz/`)
3. Paste it as the `url` field value

## How Posts Are Displayed

- **Homepage**: The 3 most recent (non-draft) posts are shown in the Instagram Feed section
- **Content pages**: Individual posts can be embedded using the `<Instagram>` MDX component

## Embedding in Content Pages

In any `.mdx` file, import and use the Instagram component:

```mdx
import Instagram from '@mdx/Instagram.astro';

<Instagram url="https://www.instagram.com/p/ABC123/" />
```

You can also pass just the shortcode:

```mdx
<Instagram url="ABC123" />
```

## Removing a Post

Delete the `.md` file from `src/content/instagram/`. The post will no longer appear on the site after the next build.

## Hiding a Post Temporarily

Set `isDraft: true` in the frontmatter. The post will be hidden in production but still visible during development.
