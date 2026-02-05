# YouTube Component

Responsive, privacy-enhanced YouTube video embed for MDX files.

## Usage

```mdx
import YouTube from '@mdx/YouTube.astro';

<YouTube id="dQw4w9WgXcQ" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | YouTube video ID or full URL |
| `title` | `string` | `"YouTube video"` | Iframe title (accessibility) |
| `width` | `string` | `"100%"` | CSS width: `"50%"`, `"800px"`, etc. |
| `start` | `number` | — | Start time in seconds |
| `class` | `string` | — | Additional CSS classes |

## Supported URL Formats

All of these work as the `id` prop:

```
dQw4w9WgXcQ
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
https://www.youtube.com/shorts/dQw4w9WgXcQ
```

## Examples

**Basic:**
```mdx
<YouTube id="dQw4w9WgXcQ" />
```

**From a URL (paste directly from browser):**
```mdx
<YouTube id="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

**With title and start time:**
```mdx
<YouTube id="dQw4w9WgXcQ" title="My Talk" start={90} />
```

**Custom width (centered):**
```mdx
<Center>
  <YouTube id="dQw4w9WgXcQ" width="60%" />
</Center>
```

**Inside a SideBySide layout:**
```mdx
<SideBySide>
  <Left>
    <YouTube id="dQw4w9WgXcQ" />
  </Left>
  <Right>
    Description text here.
  </Right>
</SideBySide>
```
