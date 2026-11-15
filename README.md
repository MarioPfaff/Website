# Mario Pfaff — personal website

A static Nuxt website for projects and personal/technical writing. Everything is built from ordinary files in `content/`. GitHub Pages hosts the result; there is no server, database, external font or analytics. All content can be edited in the browser with [Pages CMS](https://pagescms.org) (configured in `.pages.yml`), or by hand.

## Content structure

```text
content/
  site.json          name, home page intro and photo, "now" line, work line, links
  about.md           the about page (front matter: title, photo)
  categories.json    post categories and their label colour (rust, sage or tan)
  blog/*.md          blog posts            → /blog/<file-name>
  projects/*.md      one file per project  → /projects/<file-name>
  notes/*.md         build notes; each has a `project:` field → /projects/<project>/posts/<file-name>
  images/            every uploaded image  → /media/images/<file-name>
```

File names become addresses, so use lowercase words with hyphens. Copy a file from `templates/` to start a post, a build note or a project.

Front matter that the build checks:

- **Posts and build notes:** `title`, `date` (YYYY-MM-DD), `draft` (true/false), optional `description`, `category` (an id from `categories.json`), `tags`. Build notes also need `project`: the project's file name without `.md` (Pages CMS stores the file path, which also works).
- **Projects:** `title`, `description`, `draft`, optional `status`, `technologies`, `repositoryUrl`, `websiteUrl`, `order` and `photos`. The body is the project page. The first photo is the polaroid on the home page.
- **Photos** (projects, `site.json`, `about.md`): `{ src, alt, caption }`. `src` is `/media/images/<file>` for a file in `content/images`. Alt text is required. An empty `src` means no photo.

In Markdown, write images as `![What it shows](/media/images/photo.jpg)`. A line in italics directly under an image becomes its caption. Images in writing get the same polaroid frame.

Drafts are never published, and nor are images used only by drafts. A draft project hides its build notes too.

## Editing with Pages CMS

1. Push this repository to GitHub (the `.pages.yml` file must be in the repository root).
2. Open Pages CMS, sign in with GitHub and install its GitHub App on this repository only.
3. Edit posts, projects, build notes, site settings, the about page and categories. Saving commits to the repository; the GitHub Pages workflow rebuilds and publishes the site.

If a change breaks a rule (for example a missing alt text), the build fails and the live site stays as it was. The failing step in the repository's Actions tab names the file and the problem.

When you add a category, also add it to the `category` component at the top of `.pages.yml`.

Photos are published at the size they're uploaded. Resize large camera photos (around 1600px on the long side is plenty) before uploading.

## Run and build

Use Node 24.15 or newer. On Windows, `preview-site.bat` installs packages if needed, runs the tests and starts the dev server.

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run generate
npm run check:static
npm run preview
```

The dev server rebuilds the content by itself when files in `content/` or `scripts/` change. `nuxt.config.ts` runs `scripts/build-content.mjs` in its own process, so it always uses the current scripts. The deployable site is `.output/public`.

## Source versus generated files

Edit `content/`, `templates/` and the frontend source. These files are generated:

- `app/data/content.json` — compiled site settings, projects, posts and categories.
- `.generated/public/` — public files plus the images that published content uses.
- `.output/public/` — the finished website.

Raw content files are never published as downloads. If the GitHub repository is public, its source (including drafts) is still visible there.

## Hosting on GitHub Pages

The workflow in `.github/workflows/pages.yml` runs the tests, type check and format check, generates the site, checks every page's links and publishes `.output/public` on pushes to `main`. Under repository Settings → Pages, choose **GitHub Actions**. `public/CNAME` keeps the custom domain.

For hosting under a repository subpath, set `NUXT_APP_BASE_URL=/repository-name/` in the build environment and remove `public/CNAME`.

## Design

A warm, cosy personal site in a lo-fi palette (based on [Tokyo Lo-fi 8](https://lospec.com/palette-list/tokyo-lo-fi-8)):

- Cream paper with a fine grain and a soft lamp glow in the top corner by day; a warm near-black desk with a faint rust glow by night. The theme follows the visitor's light/dark system setting.
- The scrapbook lives only in the photos: taped, slightly tilted polaroids with italic captions. Everything you read stays clean and straight.
- Posts carry a flat category label in one of three colours.
- Newsreader for titles and reading, Source Sans 3 for the interface, JetBrains Mono for code and small metadata. All fonts are local, with licences in `public/fonts/`.

The colours live in `app/models/SiteTheme.mjs`. `tests/site-theme.test.mjs` checks them for comfortable long reading (APCA Lc 75 for body text, Lc 60 for secondary text and links, WCAG 4.5:1 for labels).

## Code structure

- `scripts/content/` reads and validates content: `SiteReader`, `CategoryReader`, `ProjectReader`, `PostReader`, `MediaLibrary` (images), `MarkdownRenderer` and `AssetPublisher`. `ContentBuilder` coordinates them; `scripts/catalog.mjs` is the entry point used by Nuxt and the tests.
- `app/repositories/ContentRepository.ts` owns content lookups and filtering; `app/models/Content.ts` defines the types.
- `app/composables/` holds the presentation logic, as objects with short, verb-plus-attribute functions: `useSite()` (`getNowText`, `getFooterText`), `useProject(project)`, `usePost(post)`, `useArchive(filter)` (`isCurrentCategory`, `getCurrentMarker`), `usePolaroid()` (`getPlacement`), `usePageMeta`, plus `useRouteProject()` / `useRoutePost()` for pages that 404 on unknown addresses.
- `app/components/` holds small building blocks (`PageIntro`, `PolaroidPhoto`, `PostListItem`, `ProjectCard`, `SiteFooter`, …) that use those composables instead of inline logic; `app/pages/` composes them.

## Code style

- Use descriptive names. Name each item in the singular (`post`, `project`, `category`), and collections with a container suffix: `postCollection`, `imageMap`, `imageExtensionSet`.
- Prefer action–subject function names such as `readFile`, `createAssetUrl` and `render`. Use `is` and `has` for predicates.
- Keep business logic in focused classes with explicit dependencies; prefer composition over inheritance.
- Keep Vue components small. Pages compose components, the content repository handles lookups and filtering, and composables handle reactive navigation.
- Keep the content format and URLs compatible, and keep `.pages.yml` in step with the content format so everything stays editable in Pages CMS.
- Keep the design consistent with the principles above: photos get the scrapbook treatment, text stays clean. New colours go in `app/models/SiteTheme.mjs` and must pass its contrast tests. Personal text belongs in `content/`, not in components.
- Run `npm run format`, `npm run typecheck`, `npm test`, `npm run generate` and `npm run check:static` after changes; the workflow runs the same checks.
