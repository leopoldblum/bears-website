---
title: "Managing Projects"
description: "How to add, edit, and organize team projects."
order: 21
group: "Content"
---

Projects are stored in `src/content/projects/` as Markdown or MDX files.

## Creating a Project

Create a new file in `src/content/projects/` with the naming convention `YYYY MM DD title.md`:

```yaml
---
title: "Autonomous Rover Prototype"
description: "Development of an AI-powered rover with autonomous navigation capabilities."
date: 2025-11-20
categoryProject: "robotics"
coverImage: "project-10.jpg"
isProjectCompleted: false
displayMeetTheTeam: true
headOfProject: "Jane Doe"
---
```

The body of the file is written in Markdown and becomes the project's detail page content.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project title |
| `description` | string | Short summary shown on cards |
| `date` | date | Project date (`YYYY-MM-DD`) |
| `categoryProject` | enum | One of: `experimental-rocketry`, `science-and-experiments`, `robotics`, `other` |
| `coverImage` | string | Filename of cover image in `src/assets/projects/` |
| `isProjectCompleted` | boolean | Set to `true` when the project is finished |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `isDraft` | boolean | Set to `true` to hide in production (default: `false`) |
| `displayMeetTheTeam` | boolean | Show a "Meet the Team" section on the project page |
| `headOfProject` | string | Name of the project lead (**required** if `displayMeetTheTeam` is `true`) |

## Cover Images

Place cover images in `src/assets/projects/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Meet the Team

If you set `displayMeetTheTeam: true`, you must also provide `headOfProject`. The build will fail if `headOfProject` is missing when `displayMeetTheTeam` is enabled.
