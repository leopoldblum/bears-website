# How to Add a New Testimonial

## Quick Start

1. Create a new `.md` file in this directory (`src/content/testimonials/`)
2. Add the testimonial image to `src/assets/testimonials/`
3. Fill in the frontmatter fields using the template below

## Testimonial Template

```markdown
---
quote: "Your testimonial quote goes here."
name: "Member Full Name"
role: "Role / Year / Program"
image: "member-photo.jpg"
---
```

Leave the file empty after the frontmatter (no content needed in the markdown body).

**Note**: Testimonials are displayed in alphabetical order by filename. Use numeric prefixes to control order (e.g., `01-first.md`, `02-second.md`).

## Field Descriptions

**`quote`** (required) - The testimonial text (1-3 sentences works best)

**`name`** (required) - Full name of the person

**`role`** (required) - Additional context (role, year, program, etc.)
- Examples: `"Team Lead / 2023 / Electrical Engineering"` or `"Alumni / Class of 2022"`

**`image`** (required) - Just the filename (not the full path)
- Place the actual image file in `src/assets/testimonials/`
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Recommended: 400x400px square images

## Complete Example

**File**: `src/content/testimonials/01-alex-johnson.md`

```markdown
---
quote: "Being part of BEARS taught me not just technical skills, but also how to work effectively in a team."
name: "Alex Johnson"
role: "Former President / 2023 / Mechanical Engineering"
image: "alex-johnson.jpg"
---
```

**Image**: Place `alex-johnson.jpg` in `src/assets/testimonials/`

**Filename Tip**: The `01-` prefix ensures this testimonial appears first alphabetically.

## Managing Testimonials

**Edit**: Modify the `.md` file and save

**Reorder**: Rename files to change their alphabetical order (e.g., rename `05-name.md` to `01-name.md` to move it to the front)

**Remove**: Delete the `.md` file (and optionally the image)
