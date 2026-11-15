// Builds app/data/content.json. Run as its own process (see nuxt.config.ts) so every build
// uses the current content scripts instead of a copy cached by a long-running dev server.
import { buildContent } from './catalog.mjs'

buildContent()
