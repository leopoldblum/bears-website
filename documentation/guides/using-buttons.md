> **👥 For Content Creators**
>
> **Looking for technical details?** See [Button Component Guide](../docs/button-component-guide.md) for developers.

# Using Buttons in MDX Content

A quick guide for adding buttons to your content pages.

## Quick Start

Every MDX file that uses buttons needs this import at the top:

```mdx
---
import Button from '../components/reusable/Button.astro'
---

# Your Page Title

Your content here...

<Button>Click Me</Button>
```

**Result:** A red pill-shaped button with "Click Me" text.

## Button Styles

Choose the style that matches your section's background and purpose.

### Primary (Default)

Bright red button for main actions. Use this for your most important call-to-action.

```mdx
<Button variant="primary">Join BEARS</Button>
```

**Looks like:** Red background with white text, darkens when you hover over it.

**Use for:** Main CTAs, important actions, "Join", "Sign Up", "Get Started"

### Secondary

Outlined button for less prominent actions. Shows a red border with transparent background.

```mdx
<Button variant="secondary">Learn More</Button>
```

**Looks like:** Transparent background with red outline, fills with red on hover.

**Use for:** Secondary actions, "Learn More", "Read Documentation", alternative options

### Inverse

Dark button for light-colored sections. Use when your section has a light background.

```mdx
<Button variant="inverse">Contact Us</Button>
```

**Looks like:** Dark background with white text, slightly fades on hover.

**Use for:** Buttons on light backgrounds (like the sponsors section)

## Button Sizes

### Standard (Default)

Regular size for most use cases.

```mdx
<Button>Standard Size</Button>
```

### Large

Bigger, more prominent button for important CTAs.

```mdx
<Button size="large">Large Button</Button>
```

**When to use large:** End of articles, major CTAs, standalone buttons that need emphasis.

## Making Buttons Clickable

Add the `href` attribute to turn buttons into links.

### Internal Links

Link to other pages on the BEARS website:

```mdx
<Button href="/about-us">About BEARS</Button>
<Button href="/projects">View Projects</Button>
<Button href="/events">Upcoming Events</Button>
```

### External Links

Link to external websites (downloads, social media, etc.):

```mdx
<Button href="https://github.com/bears">GitHub</Button>
<Button href="/files/brochure.pdf">Download Brochure</Button>
```

**Note:** External links will work just like internal links. The button handles everything for you.

## Common Examples

### Call to Action at End of Article

```mdx
---
import Button from '../components/reusable/Button.astro'
---

# Our Amazing Project

Your article content here...

## Get Involved

Want to be part of this project?

<Button variant="primary" size="large" href="/contact">
  Contact Our Team
</Button>
```

### Multiple Buttons Side by Side

```mdx
# Join Our Community

<div style="display: flex; gap: 1rem;">
  <Button variant="primary" href="/join">Join Now</Button>
  <Button variant="secondary" href="/learn-more">Learn More</Button>
</div>
```

### Download or Resource Link

```mdx
## Resources

Download our latest documentation:

<Button href="/files/documentation.pdf">Download PDF</Button>
```

### Navigation Button

```mdx
Want to see what we've built?

<Button variant="primary" href="/projects">
  Explore Our Projects
</Button>
```

## Combining Options

You can mix and match variant, size, and href:

```mdx
<!-- Large primary button with link -->
<Button variant="primary" size="large" href="/signup">
  Sign Up Today
</Button>

<!-- Standard secondary button with link -->
<Button variant="secondary" href="/docs">
  Read Documentation
</Button>

<!-- Large inverse button (for light backgrounds) -->
<Button variant="inverse" size="large" href="/contact">
  Get in Touch
</Button>
```

## Quick Reference

| What You Want | Code |
|---------------|------|
| Basic button | `<Button>Text</Button>` |
| Red button (primary) | `<Button variant="primary">Text</Button>` |
| Outlined button | `<Button variant="secondary">Text</Button>` |
| Dark button (light bg) | `<Button variant="inverse">Text</Button>` |
| Bigger button | `<Button size="large">Text</Button>` |
| Button with link | `<Button href="/page">Text</Button>` |
| Large primary with link | `<Button variant="primary" size="large" href="/page">Text</Button>` |

## Tips & Best Practices

### Choosing a Variant

- **Use primary** for the main action you want users to take
- **Use secondary** when you have multiple options (pair with a primary button)
- **Use inverse** when your section has a light background color

### Button Text

- Keep it short and actionable: "Join Now", "Learn More", "Download"
- Avoid generic text like "Click Here"
- Be specific: "Download Brochure" is better than "Download"

### Accessibility

- Button text should describe what happens when clicked
- If your button links somewhere, the text should indicate the destination
- Avoid using buttons just for decoration - they should do something

## Complete Example

Here's a complete MDX file using buttons:

```mdx
---
import Button from '../components/reusable/Button.astro'
---

# Join the BEARS Community

We're a student organization focused on aerospace engineering and research. Our members work on cutting-edge projects ranging from high-altitude balloons to autonomous rovers.

## Why Join?

- Hands-on experience with real projects
- Mentorship from industry professionals
- Networking opportunities
- Access to our workshop and tools

## Ready to Get Started?

<Button variant="primary" size="large" href="/join">
  Become a Member
</Button>

<Button variant="secondary" href="/about">
  Learn More About Us
</Button>

## Questions?

If you have any questions about membership, check out our FAQ or contact us directly.

<Button href="/faq">View FAQ</Button>
```

## Need Help?

If you need more advanced features (custom styling, JavaScript interactions, etc.), refer to the [full Button Component Guide](../docs/button-component-guide.md) for developers.
