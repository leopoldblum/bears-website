---
name: "EXAMPLE FILE - NOT A REAL SPONSOR"
logo: "gold-placeholder-1.png"
tier: "gold"
---

# How to Add a New Sponsor

## Quick Start

1. Create a new `.md` file in the appropriate tier folder (`src/content/sponsors/gold/`, `silver/`, or `bronze/`)
2. Add the sponsor logo to `src/assets/sponsors/`
3. Fill in the frontmatter fields using the template below

## Sponsor Template

```markdown
---
name: "Company Name"
logo: "company-logo.png"
url: "https://example.com"
tier: "gold"
---
```

Leave the file empty after the frontmatter (no content needed in the markdown body).

**Note**: Sponsors are organized in tier subfolders and sorted alphabetically by filename within each tier. Use numeric prefixes to control order.

## Field Descriptions

**`name`** (required) - Full name of the sponsor organization

**`logo`** (required) - Just the filename (not the full path)
- Place the actual logo file in `src/assets/sponsors/`
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Recommended sizes:
  - Gold: 160x160px
  - Silver: 80x80px
  - Bronze: 64x64px

**`url`** (optional) - Sponsor's website URL
- Must be a valid URL starting with `https://` or `http://`
- If omitted, the logo will not be clickable

**`tier`** (required) - Sponsorship level
- Must be one of: `"bronze"`, `"silver"`, or `"gold"`
- Must match the subfolder where the file is located
- Determines logo size and display order

## Folder Organization

Sponsors are organized in tier-specific subfolders:

```
src/content/sponsors/
├── gold/        (Gold tier sponsors - displayed first, largest logos)
├── silver/      (Silver tier sponsors - displayed second, medium logos)
└── bronze/      (Bronze tier sponsors - displayed last, smallest logos)
```

**Ordering within a tier**:
- Sponsors are sorted alphabetically by filename
- Use numeric prefixes (01-, 02-, etc.) to control the exact order
- Examples: `01-main-sponsor.md`, `02-another-sponsor.md`

## Complete Examples

### Gold Tier Sponsor

**File**: `src/content/sponsors/gold/01-acme-corp.md`

```markdown
---
name: "ACME Corporation"
logo: "acme-logo.png"
url: "https://acme.example.com"
tier: "gold"
---
```

**Logo**: Place `acme-logo.png` (160x160px) in `src/assets/sponsors/`

### Silver Tier Sponsor

**File**: `src/content/sponsors/silver/01-widgets-inc.md`

```markdown
---
name: "Widgets Inc"
logo: "widgets-logo.png"
url: "https://widgets.example.com"
tier: "silver"
---
```

**Logo**: Place `widgets-logo.png` (80x80px) in `src/assets/sponsors/`

### Bronze Tier Sponsor (No URL)

**File**: `src/content/sponsors/bronze/01-local-startup.md`

```markdown
---
name: "Local Startup"
logo: "startup-logo.png"
tier: "bronze"
---
```

**Logo**: Place `startup-logo.png` (64x64px) in `src/assets/sponsors/`

**Note**: This sponsor has no URL, so the logo will display without a clickable link.

## Managing Sponsors

**Edit**: Modify the `.md` file in the appropriate tier folder and save

**Reorder within tier**: Rename files to change alphabetical order (e.g., rename `02-name.md` to `01-name.md` to move it first)

**Change tier**:
1. Move the `.md` file to the new tier folder
2. Update the `tier` field in the frontmatter to match
3. Adjust the filename prefix if needed

**Remove**: Delete the `.md` file (and optionally the logo from `src/assets/sponsors/`)
