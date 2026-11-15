# mariopfaff.com

The source of my personal site, **[mariopfaff.com](https://mariopfaff.com)**: retrospectives on C++ and embedded projects, the odd game review, and whatever else I'm working on or noticing. It's a static [Nuxt](https://nuxt.com) site built from the Markdown and JSON files in `content/`, edited with [Pages CMS](https://pagescms.org) and published to GitHub Pages on every push to `main`.

```sh
npm ci
npm run dev        # local preview
npm test           # content rules and colour contrast
npm run generate   # static site in .output/public
```

The code is licensed under the [GNU GPL v3](LICENSE). The writing, photos and other content in `content/` are © Mario Pfaff, all rights reserved.
