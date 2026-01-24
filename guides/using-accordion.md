> **👥 For Content Creators**
>
> **Looking for technical details?** See [Accordion Component Documentation](../src/components/reusable/Accordion.md) for developers.

# Using Accordions in MDX Content

A quick guide for adding collapsible accordion sections to your content pages. Accordion content is written in Markdown for easy formatting.

## What is an Accordion?

An accordion is a UI component that lets you display multiple sections of content where only one section can be expanded at a time. When you click a section header, it expands to show the content while automatically collapsing the previously opened section.

**Behavior:**
- If you don't set a default open section (or use `defaultOpen={null}`), you can click any open section to close it, returning to an all-closed state.
- If you set a default open section (e.g., `defaultOpen={0}`), one section will always remain open. Clicking a section switches which one is open.

**Perfect for:**
- Lists of related topics (research areas, features, categories)
- FAQ sections
- Project details with multiple subsections
- Any content where you want to save space and let users focus on one topic at a time

## Quick Start

Every MDX file that uses accordions needs this import at the top:

```mdx
---
import Accordion from '../../../components/reusable/Accordion.astro';
---

# Your Page Title

Your content here...

<Accordion
  items={[
    {
      title: "First Section",
      content: "This is the content of the first section."
    },
    {
      title: "Second Section",
      content: "This is the content of the second section."
    }
  ]}
/>
```

**Result:** A collapsible accordion where clicking each title expands that section and collapses the others.

## Basic Structure

An accordion needs an `items` array with at least these two fields for each item:

```mdx
<Accordion
  items={[
    {
      title: "Section Title",           // Required: The clickable header
      content: "Section content here."  // Required: The text that shows when expanded
    }
  ]}
/>
```

## Simple Example

```mdx
<Accordion
  items={[
    {
      title: "What is BEARS?",
      content: "BEARS is a student organization focused on aerospace engineering, rocketry, and space exploration research."
    },
    {
      title: "Who can join?",
      content: "All students interested in aerospace, engineering, or space science are welcome to join BEARS."
    },
    {
      title: "How do I get started?",
      content: "Visit our membership page and fill out the application form. We'll get back to you within a week."
    }
  ]}
/>
```

## Setting Which Section Opens First

By default, all sections are closed when the page loads. You can change this with `defaultOpen`:

```mdx
<Accordion
  items={[ /* your items */ ]}
/>
<!-- OR -->
<Accordion
  items={[ /* your items */ ]}
  defaultOpen={null}  // All sections closed (this is the default)
/>

<Accordion
  items={[ /* your items */ ]}
  defaultOpen={0}  // Opens first item
/>

<Accordion
  items={[ /* your items */ ]}
  defaultOpen={1}  // Opens second item
/>

<Accordion
  items={[ /* your items */ ]}
  defaultOpen={2}  // Opens third item
/>
```

**Note:** Counting starts at 0, so the first item is 0, second is 1, third is 2, and so on. Use `null` (or omit the prop) to start with all sections closed.

## Controlling Toggle Behavior

By default, the accordion's toggle behavior automatically matches your `defaultOpen` setting:
- When `defaultOpen` is omitted or `null` → you can close all sections
- When `defaultOpen` is set to a number → one section must always be open

If you need different behavior, you can explicitly control it with `allowCloseAll`:

```mdx
<Accordion
  items={[ /* your items */ ]}
  defaultOpen={0}
  allowCloseAll={true}  // Override: allow closing all even though defaultOpen is set
/>

<Accordion
  items={[ /* your items */ ]}
  allowCloseAll={false}  // Override: one must always be open even though defaultOpen is null
/>
```

**When to use `allowCloseAll`:**
- Usually you don't need this prop - the automatic behavior works for most cases
- Use it when you need one section to always be open, but want to start with all sections closed
- Use it when you want to force toggle behavior even with a default open section

## Allowing Multiple Sections Open

By default, only one accordion section can be open at a time. When you click a new section, it opens and the previous one closes automatically.

If you want to allow multiple sections to be open at the same time, use the `allowMultiple` prop:

```mdx
<Accordion
  items={[ /* your items */ ]}
  allowMultiple={true}
/>
```

**How it works:**
- Each section toggles independently - clicking it opens or closes it
- Other sections stay in their current state (open or closed)
- You can have all sections open, some open, or all closed
- Great for checklists, feature comparisons, or when users need to see multiple sections at once

### When to Use Each Mode

**Single mode (default):**
- FAQ sections - users focus on one question at a time
- Tutorial steps - show one step at a time
- Project details - focus on one aspect at a time
- When you want to guide users through content sequentially

**Multi mode (`allowMultiple={true}`):**
- Feature checklists - users can compare multiple features
- Research categories - users can browse multiple areas simultaneously
- Specification lists - users can view multiple specs at once
- When sections are independent and users might need to compare them

### Example: Feature Checklist

```mdx
<Accordion
  items={[
    {
      title: "Data Collection Features",
      content: `
- Temperature sensors
- Pressure monitoring
- Acceleration tracking
      `
    },
    {
      title: "Analysis Tools",
      content: `
- Real-time graphing
- Statistical analysis
- Export to CSV
      `
    },
    {
      title: "Safety Features",
      content: `
- Emergency stop system
- Automatic alerts
- Backup systems
      `
    }
  ]}
  allowMultiple={true}
  defaultOpen={0}
/>
```

**Result:** Users can open multiple sections to compare features side-by-side. The first section starts open, but users can open as many sections as they want.

## Using Markdown for Content

Accordion content supports full Markdown syntax, making it easy to add rich formatting like lists, bold text, links, and more.

**Supported Markdown features:**
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Links and inline code
- Code blocks
- Tables (GitHub Flavored Markdown)
- Headings and blockquotes

**Important:** Wrap content with **backticks** (`` ` ``) to preserve formatting:

```mdx
<Accordion
  items={[
    {
      title: "Research Focus Areas",
      content: `
- High-altitude balloon experiments
- Autonomous rover development
- Satellite systems engineering
- Rocketry and propulsion research
      `
    },
    {
      title: "Current Projects",
      content: `
We have **12 active projects** across multiple research areas.

Visit our [projects page](/projects) to learn more about each initiative.
      `
    }
  ]}
/>
```

## Adding Subtitles (Optional)

You can add a subtitle or metadata to each section that appears below the title when expanded:

```mdx
<Accordion
  items={[
    {
      title: "Microgravity Research Platform",
      subtitle: "Dr. Sarah Williams - Lead Researcher",
      content: "This project focuses on conducting drop tower experiments for materials science research in microgravity conditions."
    },
    {
      title: "High-Altitude Balloon Program",
      subtitle: "Prof. Michael Chen - Principal Investigator",
      content: "We launch weather balloons carrying scientific instruments to study atmospheric conditions."
    }
  ]}
/>
```

**Result:** The subtitle appears in red text below the title when the section is expanded.

## Common Examples

### FAQ Section

```mdx
---
import Accordion from '../../../components/reusable/Accordion.astro';
---

# Frequently Asked Questions

<Accordion
  items={[
    {
      title: "How much does membership cost?",
      content: "Membership is free for all registered students. We're funded through university grants and sponsorships."
    },
    {
      title: "Do I need prior experience?",
      content: "No experience is required! We welcome students of all skill levels and provide training for new members."
    },
    {
      title: "What time commitment is required?",
      content: "Most members participate 3-5 hours per week, but you're welcome to contribute as much or as little as your schedule allows."
    },
    {
      title: "Can I work on multiple projects?",
      content: "Absolutely! Many members contribute to multiple teams. We encourage exploring different areas of aerospace engineering."
    }
  ]}
  defaultOpen={0}
/>
```

### Research Areas with Lists

```mdx
## Our Research Focus

<Accordion
  items={[
    {
      title: "Materials Science",
      content: `
- Crystal growth in microgravity
- Metallurgical solidification processes
- Polymer behavior without gravitational influence
- Phase separation in alloys
      `
    },
    {
      title: "Fluid Dynamics",
      content: `
- Surface tension effects
- Capillary flow in reduced gravity
- Two-phase flow behavior
- Droplet dynamics and coalescence
      `
    },
    {
      title: "Biological Research",
      content: `
- Cell behavior in microgravity
- Plant growth responses
- Bacterial colony formation
- Protein crystallization
      `
    }
  ]}
  defaultOpen={0}
/>
```

### Project Teams

```mdx
## Active Project Teams

<Accordion
  items={[
    {
      title: "Rocketry Team",
      subtitle: "Team Lead: Alex Thompson",
      content: "Design, build, and launch high-powered rockets for regional competitions. Meets Wednesdays at 6 PM in the workshop."
    },
    {
      title: "Satellite Systems",
      subtitle: "Team Lead: Jennifer Lee",
      content: "Develop CubeSat technology and ground station communications. Meets Thursdays at 7 PM in Lab 204."
    },
    {
      title: "Rover Development",
      subtitle: "Team Lead: Marcus Rodriguez",
      content: "Build autonomous rovers for university rover challenge competitions. Meets Tuesdays at 5 PM in the workshop."
    }
  ]}
/>
```

## Import Path Guide

The path in your import depends on where your MDX file is located:

### For Project/Event Posts

If your file is in `/src/content/posts/projects/` or `/src/content/posts/events/`:

```mdx
import Accordion from '../../../components/reusable/Accordion.astro';
```

### For Other Locations

Adjust the path based on how many folders up you need to go to reach the `src/` directory:

- One level up: `../components/reusable/Accordion.astro`
- Two levels up: `../../components/reusable/Accordion.astro`
- Three levels up: `../../../components/reusable/Accordion.astro`

**Tip:** If you're not sure about the path, ask a developer or check how other components are imported in existing MDX files.

## Tips & Best Practices

### Section Titles

- Keep titles short and descriptive (3-8 words)
- Use questions for FAQ sections: "How do I join?"
- Use topic names for content sections: "Materials Science", "Project Overview"
- Capitalize important words for consistency

### Content Organization

- Group related information together
- Put the most important or frequently asked section first
- Use 3-6 sections for best user experience (too many can be overwhelming)
- Keep content concise - users should be able to scan quickly

### Using Markdown in Content

- Always wrap Markdown content with backticks (`` `content here` ``)
- Use `-` or `*` for bulleted lists
- Use blank lines to separate paragraphs
- Use `**text**` for bold and `*text*` for italic
- Use `[text](url)` for links
- Keep formatting consistent across all sections

### Accessibility

- Titles should clearly describe what's inside
- Avoid vague titles like "More Info" or "Details"
- Content should be readable and well-structured
- The accordion handles keyboard navigation automatically

## Complete Example

Here's a complete MDX file using an accordion:

```mdx
---
import Accordion from '../../../components/reusable/Accordion.astro';
import Button from '../../../components/reusable/Button.astro';
---

# Microgravity Research Platform

Our drop tower facility enables cutting-edge research in near-weightless conditions.

## Research Focus Areas

<Accordion
  items={[
    {
      title: "Materials Science",
      content: `
- Crystal growth in microgravity
- Metallurgical solidification processes
- Polymer behavior studies
- Phase separation in alloys
      `
    },
    {
      title: "Fluid Dynamics",
      content: `
- Surface tension effects
- Capillary flow in reduced gravity
- Two-phase flow behavior
- Droplet dynamics and coalescence
      `
    },
    {
      title: "Biological Research",
      content: `
- Cell behavior in microgravity
- Plant growth responses
- Bacterial colony formation
- Protein crystallization
      `
    },
    {
      title: "Physics & Combustion",
      content: `
- Flame behavior without buoyancy
- Particle dynamics
- Heat transfer studies
- Granular material flow
      `
    }
  ]}
  defaultOpen={0}
/>

## Get Involved

Interested in participating in microgravity research?

<div class="flex justify-center mt-8">
  <Button variant="primary" size="large" href="/contact">
    Submit Experiment Proposal
  </Button>
</div>
```

## Combining with Other Components

Accordions work great alongside other components like buttons and carousels:

```mdx
## Learn More About BEARS

<Accordion
  items={[
    { title: "Our Mission", content: "..." },
    { title: "Our Values", content: "..." },
    { title: "Our History", content: "..." }
  ]}
/>

<div class="mt-8 flex gap-4">
  <Button variant="primary" href="/join">Join Us</Button>
  <Button variant="secondary" href="/projects">View Projects</Button>
</div>
```

## Need Help?

If you need more advanced features or run into issues, refer to the [full Accordion Component Documentation](../src/components/reusable/Accordion.md) for developers or reach out to the web team.
