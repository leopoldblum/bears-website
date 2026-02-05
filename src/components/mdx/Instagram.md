# Instagram Component

Responsive Instagram post embed for MDX files.

## Usage

```mdx
import Instagram from '@mdx/Instagram.astro';

<Instagram url="https://www.instagram.com/p/ABC123/" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | **required** | Instagram post URL or shortcode |
| `maxWidth` | `string` | `"540px"` | CSS max-width for the embed |
| `class` | `string` | — | Additional CSS classes |

## Supported URL Formats

All of these work as the `url` prop:

```
ABC123
https://www.instagram.com/p/ABC123/
https://www.instagram.com/reel/ABC123/
https://www.instagram.com/tv/ABC123/
```

## Examples

**Basic:**
```mdx
<Instagram url="https://www.instagram.com/p/ABC123/" />
```

**Full width:**
```mdx
<Instagram url="ABC123" maxWidth="100%" />
```

**Inside a SideBySide layout:**
```mdx
<SideBySide>
  <Left>
    <Instagram url="ABC123" />
  </Left>
  <Right>
    Description text here.
  </Right>
</SideBySide>
```

## How It Works

The component renders an Instagram `<blockquote>` element and loads Instagram's `embed.js` script. The script transforms the blockquote into a rich embed iframe on the client side. Before the script loads, a fallback link is shown.

Multiple Instagram embeds on the same page share a single `embed.js` script (automatically deduplicated).
