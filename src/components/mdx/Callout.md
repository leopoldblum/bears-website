# Callout Component

Glass-morphism highlight card for emphasizing important text in MDX content pages. Features a top accent gradient bar and subtle translucent background.

## Usage

```mdx
import Callout from '@mdx/Callout.astro';

<Callout title="Important">
  This experiment requires **safety goggles** and a [signed waiver](/contact).
</Callout>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Optional bold label above the content |
| `class` | `string` | — | Additional CSS classes |

## Examples

**With title:**
```mdx
<Callout title="Safety Notice">
  All participants must wear protective equipment during the launch.
</Callout>
```

**Without title:**
```mdx
<Callout>
  The launch window opens March 15th. Check the events page for details.
</Callout>
```

**With rich Markdown content:**
```mdx
<Callout title="Requirements">
  - Python 3.10+
  - Arduino IDE
  - A working **ESP32** board

  See the [setup guide](/projects/setup) for installation instructions.
</Callout>
```

**Custom width (centered):**
```mdx
<Center>
  <Callout title="Note" class="max-w-lg">
    Brief highlighted note with constrained width.
  </Callout>
</Center>
```
