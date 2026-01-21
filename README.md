# Astro.js Website for BEARS

## Local Quickstart

```sh
npm install
npm run dev
```

## 🚀 Project Structure

```text
/
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── assets/          # Images organized by content type
│   │   ├── events/
│   │   ├── projects/
│   │   ├── sponsors/
│   │   ├── testimonials/
│   │   └── whatIsBears/
│   │
│   ├── components/      # Astro components
│   │   └── reusable/    # Reusable UI components
│      
├── content/         # Content collections (MDX)
│   │   ├── posts/       # Events and projects
│   │   ├── sponsors/    # Sponsor tiers
│   │   └── testimonials/
│   │
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
│   
├── guides/              # Documentation for content creators
├── astro.config.mjs
├── CLAUDE.md            # AI assistant instructions
├── package.json
└── tsconfig.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
