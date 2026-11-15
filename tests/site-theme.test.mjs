import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Colour } from './support/Colour.mjs'
import { SiteTheme, siteThemeMap, categoryToneMap } from '../app/models/SiteTheme.mjs'

const flattenColour = (colour, backgroundColour) =>
  colour.length === 9
    ? Colour.mix(backgroundColour, colour.slice(0, 7), Number.parseInt(colour.slice(7), 16) / 255)
    : colour

for (const [themeName, theme] of Object.entries(siteThemeMap)) {
  test(`${themeName} theme keeps text comfortable for long reading`, () => {
    const bodyContrast = Math.abs(Colour.getApcaContrast(theme.ink, theme.page))
    assert.ok(bodyContrast >= 75, `body text: Lc ${bodyContrast.toFixed(1)}`)
    for (const tokenName of ['muted', 'accent']) {
      const contrast = Math.abs(Colour.getApcaContrast(theme[tokenName], theme.page))
      assert.ok(contrast >= 60, `${tokenName}: Lc ${contrast.toFixed(1)}`)
      assert.ok(Colour.getContrastRatio(theme[tokenName], theme.page) >= 4.5, tokenName)
    }
    // Captions are printed on the polaroid frame, in both themes.
    assert.ok(Colour.getContrastRatio(theme.frameInk, theme.frame) >= 7)
    assert.ok(Colour.getContrastRatio(theme.selectionInk, theme.selection) >= 4.5)
    assert.ok(Colour.getContrastRatio(flattenColour(theme.line, theme.page), theme.page) < 2)
  })
}

test('category labels stay readable', () => {
  for (const [toneName, tone] of Object.entries(categoryToneMap)) {
    const contrastRatio = Colour.getContrastRatio(tone.ink, tone.background)
    assert.ok(contrastRatio >= 4.5, `${toneName}: ${contrastRatio.toFixed(2)}`)
  }
})

test('style sheet defines both themes and the label colours', () => {
  const styleSheet = SiteTheme.createStyleSheet()
  assert.match(styleSheet, /^html:root\{color-scheme:light;--page:#ebdcbd;/)
  assert.match(styleSheet, /--tone-rust:#9c4827;--tone-rust-ink:#f7ecd6/)
  assert.match(
    styleSheet,
    /@media \(prefers-color-scheme: dark\)\{html:root\{color-scheme:dark;--page:#1d1916;/
  )
})
