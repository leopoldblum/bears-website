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
---
```

Leave the file empty after the frontmatter (no content needed in the markdown body).

**Note**: Sponsors are organized in tier subfolders and sorted alphabetically by filename within each tier. Use numeric prefixes to control order. The tier is automatically determined by the folder where the file is located.

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

**Tier** (automatically derived) - Sponsorship level
- Automatically determined by the folder where the file is located
- `gold/` folder → Gold tier (displayed first, largest logos)
- `silver/` folder → Silver tier (displayed second, medium logos)
- `bronze/` folder → Bronze tier (displayed last, smallest logos)
- No need to specify tier in frontmatter

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
---
```

**Logo**: Place `acme-logo.png` (160x160px) in `src/assets/sponsors/`

**Note**: Tier is automatically set to "gold" because the file is in the `gold/` folder.

### Silver Tier Sponsor

**File**: `src/content/sponsors/silver/01-widgets-inc.md`

```markdown
---
name: "Widgets Inc"
logo: "widgets-logo.png"
url: "https://widgets.example.com"
---
```

**Logo**: Place `widgets-logo.png` (80x80px) in `src/assets/sponsors/`

**Note**: Tier is automatically set to "silver" because the file is in the `silver/` folder.

### Bronze Tier Sponsor (No URL)

**File**: `src/content/sponsors/bronze/01-local-startup.md`

```markdown
---
name: "Local Startup"
logo: "startup-logo.png"
---
```

**Logo**: Place `startup-logo.png` (64x64px) in `src/assets/sponsors/`

**Note**: Tier is automatically set to "bronze" because the file is in the `bronze/` folder. This sponsor has no URL, so the logo will display without a clickable link.

## Managing Sponsors

**Edit**: Modify the `.md` file in the appropriate tier folder and save

**Reorder within tier**: Rename files to change alphabetical order (e.g., rename `02-name.md` to `01-name.md` to move it first)

**Change tier**:
1. Move the `.md` file to the new tier folder (e.g., from `silver/` to `gold/`)
2. The tier will be automatically updated based on the new folder location
3. Adjust the filename prefix if needed for ordering

**Remove**: Delete the `.md` file (and optionally the logo from `src/assets/sponsors/`)
