import { ContentBuilder } from './content/ContentBuilder.mjs'

export function buildContent() {
  return new ContentBuilder().build()
}
