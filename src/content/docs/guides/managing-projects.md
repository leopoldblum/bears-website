---
title: "Managing Projects"
description: "How to add, edit, and organize team projects."
order: 21
group: "Content"
---

Projects are stored in `src/content/projects/` as Markdown or MDX files.

## Creating a Project

Create a new file in `src/content/projects/` with the naming convention `YYYY MM DD title.md`:

```md
---
title: "Autonomous Rover Prototype"
description: "An AI-powered rover with autonomous navigation, computer vision, and obstacle avoidance."
date: 2025-11-20
categoryProject: "robotics"
coverImage: "project-10.jpg"
isProjectCompleted: false
isDraft: false              # Optional — defaults to false, set true to hide from production
displayMeetTheTeam: true    # Optional — show this project in the homepage "Meet the Team" section
headOfProject: "Emma Watson" # Optional — required when displayMeetTheTeam is true
personImage: "emma-watson.jpg" # Optional — required when displayMeetTheTeam is true
---

## Project Overview

The Autonomous Rover Prototype focuses on developing advanced navigation
algorithms for a Mars rover-inspired vehicle. Our goal is a fully
autonomous system capable of navigating challenging terrain while avoiding
obstacles and achieving mission objectives.
```

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
| `personImage` | string | Portrait image filename in `src/assets/projects/team-members/` (**required** if `displayMeetTheTeam` is `true`) |

## Cover Images

Place cover images in `src/assets/projects/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Meet the Team

If you set `displayMeetTheTeam: true`, you must also provide `headOfProject` and `personImage`. The build will fail if either field is missing when `displayMeetTheTeam` is enabled.

### Person Images

Place team member portrait images in `src/assets/projects/team-members/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`. Use descriptive filenames matching the person's name (e.g., `emma-watson.jpg`).
