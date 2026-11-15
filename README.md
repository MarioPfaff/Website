# mariopfaff.com

The source of my personal site, **[mariopfaff.com](https://mariopfaff.com)**: retrospectives on C++ and embedded projects, the odd game review, things I notice, and the projects I'm working on.

It's a static [Nuxt](https://nuxt.com) site built from Markdown and JSON files, published to GitHub Pages, and edited in the browser with [Pages CMS](https://pagescms.org). No server, database, tracking or external fonts.

## How it works

- **Content is plain files** in `content/`. A build step reads and validates them (required fields, alt text on every photo, links between posts) and compiles them into one JSON file the site renders from.
- **Mistakes fail the build, not the site.** If a post is missing a date or a photo has no alt text, the build stops with the file name and the problem, and the live site stays as it was.
- **Drafts stay private on the site.** Draft posts, draft projects and the images only they use are never published.
- **Everything is editable in Pages CMS** through `.pages.yml`: posts, projects, build notes, site settings, the about page and categories. Saving commits to this repository, and the GitHub Actions workflow rebuilds and publishes the site.

## Content

```text
content/
  site.json          name, home page intro and photo, "now" line, work line, links
  about.md           the about page
  categories.json    post categories and their label colour (rust, sage or tan)
  blog/*.md          posts                 → /blog/<file-name>
  projects/*.md      one file per project  → /projects/<file-name>
  notes/*.md         build notes for a project (its `project:` field) → /projects/<project>/posts/<file-name>
  images/            uploaded images       → /media/images/<file-name>
```

File names become addresses, so they're lowercase words with hyphens. `templates/` has a starting point for a post, a build note and a project.

- **Posts and build notes** need `title`, `date` (YYYY-MM-DD) and `draft`; `description`, `category` and `tags` are optional. A build note's `project` is the project's file name without `.md`.
- **Projects** need `title`, `description` and `draft`; `status`, `technologies`, `repositoryUrl`, `websiteUrl`, `order` and `photos` are optional. The body is the project page, and the first photo is its polaroid on the home page.
- **Photos** are `{ src, alt, caption }`, with `src` pointing at `/media/images/<file>`. In Markdown: `![What it shows](/media/images/photo.jpg)`, with an optional line in italics underneath as the caption.

## Development

Node 24.15 or newer.

```sh
npm ci
npm run dev            # dev server; rebuilds when content/ or scripts/ change
npm test               # content rules and colour contrast
npm run typecheck
npm run generate       # static site in .output/public
npm run check:static   # every page has a title and working local links
```

On Windows, `preview-site.bat` installs packages if needed, runs the tests and starts the dev server.

The workflow in `.github/workflows/pages.yml` runs the same checks on every push to `main` and publishes `.output/public` to GitHub Pages.

## Design

A warm, cosy reading site in a lo-fi palette (based on [Tokyo Lo-fi 8](https://lospec.com/palette-list/tokyo-lo-fi-8)):

- Cream paper with fine grain and a soft lamp glow by day; a warm near-black desk by night, following the visitor's light/dark setting.
- The scrapbook look is only for photos: taped, slightly tilted polaroids with italic captions. Everything you read stays clean and straight.
- Newsreader for reading, Source Sans 3 for the interface, JetBrains Mono for code. All fonts are served locally, with their licences in `public/fonts/`.

The colours live in `app/models/SiteTheme.mjs`, and `tests/site-theme.test.mjs` checks them for comfortable long reading (APCA Lc 75 for body text, Lc 60 for secondary text and links, WCAG 4.5:1 for labels).

## Code structure

- `scripts/content/` builds the content. Each class reads or produces one thing (`SiteReader`, `CategoryReader`, `ProjectReader`, `PostReader`, `MediaLibrary`, `MarkdownRenderer`, `AssetPublisher`), and `ContentBuilder` coordinates them.
- `app/repositories/ContentRepository.ts` looks up and filters the compiled content; `app/models/` holds the types and the theme.
- `app/composables/` holds the presentation logic as small objects, such as `usePolaroid().getPlacement(index)` or `useArchive(filter).isCurrentCategory(slug)`.
- `app/components/` are small building blocks that use those composables, and `app/pages/` composes them.

Conventions: descriptive, unabbreviated names; collections named with a suffix (`postCollection`, `imageMap`); functions named verb + attribute, without repeating the object they belong to (`postReader.readFile()`, not `readPostFile()`); short functions; logic in classes and composables rather than in templates.

## Licence

The code is licensed under the [GNU GPL v3](LICENSE). The writing, photos and other content in `content/` are © Mario Pfaff, all rights reserved.
