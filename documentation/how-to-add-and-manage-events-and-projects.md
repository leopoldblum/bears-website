# How to Add Events and Projects

## Quick Start

### For Events:
1. Create a new `.md` file in `src/content/posts/events/`
2. Add a cover image to `src/assets/events/` (optional)
3. Fill in the frontmatter fields using the template below

### For Projects:
1. Create a new `.md` file in `src/content/posts/projects/`
2. Add a cover image to `src/assets/projects/` (optional)
3. Fill in the frontmatter fields using the template below

## Template

```markdown
---
title: "Your Event or Project Title"
description: "A brief one or two sentence summary."
date: 2026-01-15
domain: "robotics"
tags: ["tag1", "tag2"]
coverImage: "cover-image.jpg"
isDraft: false
---

# Main Content

Write your full event or project description here using markdown.
```

**Note**: Events and projects are sorted by the `date` field (newest first). The filename does NOT affect display order.

## Field Descriptions

**`title`** (required) - The main headline

**`description`** (required) - Brief summary (1-2 sentences)
- Appears on listing pages and grid cards
- Keep it concise for better display

**`date`** (required) - Publication or event date in YYYY-MM-DD format
- **Controls display order** - newest dates appear first
- Example: `2026-02-10`

**`domain`** (required) - Category classification
- Must be one of: `"aerospace"`, `"robotics"`, `"ai"`, `"sustainability"`, `"education"`, `"research"`, `"other"`
- Use `"other"` for posts that don't fit the existing categories
- Used for categorization and filtering

**`tags`** (optional) - Array of tags for categorization
- Format: `["tag1", "tag2", "tag3"]`
- Use lowercase, hyphenated words for consistency
- Example: `["lecture", "mars", "robotics", "nasa"]`

**`coverImage`** (optional) - Just the filename (not the full path)
- For events: Place image in `src/assets/events/`
- For projects: Place image in `src/assets/projects/`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Recommended size: 600x400px or larger
- Images are automatically optimized to WebP format

**`isDraft`** (optional) - Draft mode flag (default: `false`)
- When `true`: visible in dev mode (`npm run dev`) but hidden in production
- When `false`: visible in both dev and production
- Use this to work on content before publishing

## Complete Examples

### Event Example

**File**: `src/content/posts/events/guest-lecture-mars-rover.md`

```markdown
---
title: "Guest Lecture: Mars Rover Engineering"
description: "A special guest lecture featuring Dr. Sarah Chen from NASA's JPL discussing Mars rover technology."
date: 2026-02-10
domain: "aerospace"
tags: ["lecture", "mars", "robotics", "nasa"]
coverImage: "guest-lecture-mars.jpg"
isDraft: false
---

## Guest Lecture Event

BEARS is thrilled to host Dr. Sarah Chen, a leading engineer from NASA's Jet Propulsion Laboratory.

### Event Information

**Date**: February 10, 2026
**Time**: 6:00 PM - 8:00 PM
**Location**: Engineering Building, Auditorium A
```

**Image**: Place `guest-lecture-mars.jpg` in `src/assets/events/`

### Project Example

**File**: `src/content/posts/projects/cubesat-tracking.md`

```markdown
---
title: "CubeSat Tracking System"
description: "A real-time tracking system for monitoring CubeSat positions and telemetry data."
date: 2025-12-10
domain: "aerospace"
tags: ["cubesat", "tracking", "satellite"]
coverImage: "cubesat-tracker.jpg"
isDraft: false
---

## Project Overview

The CubeSat Tracking System is an initiative to develop affordable tracking technology for small satellites.

### Goals
- Real-time position tracking
- Telemetry data visualization
- Open-source implementation
```

**Image**: Place `cubesat-tracker.jpg` in `src/assets/projects/`

### Draft Example (Work in Progress)

**File**: `src/content/posts/events/upcoming-workshop.md`

```markdown
---
title: "Workshop: Intro to Robotics"
description: "Hands-on workshop covering basic robotics principles."
date: 2026-03-15
domain: "robotics"
tags: ["workshop", "robotics", "beginner"]
isDraft: true
---

Content being developed...
```

This event will be visible during development but hidden in production until `isDraft` is changed to `false`.

## Managing Events and Projects

**Edit**: Modify the `.md` file and save

**Change display order**: Update the `date` field in the frontmatter
- Items with newer dates appear first on listing pages
- The filename does not affect sort order

**Hide from production**: Set `isDraft: true` to work on content privately

**Remove**: Delete the `.md` file (and optionally the cover image)

## Important Notes

- **Sorting**: Unlike sponsors and testimonials (which sort by filename), events and projects sort by the `date` field in descending order
- **Filename**: Include the date at the start and use descriptive names like `2026 01 01 kickoff-workshop.md` or `2026 05 01 cubesat-tracking.md`. 
- **Images**: Always place images in the correct folder (`src/assets/events/` or `src/assets/projects/`)
- **Content**: Write full markdown content after the frontmatter for detailed event/project pages
