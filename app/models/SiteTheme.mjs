// The two curated themes. Colours come from the Tokyo lo-fi palette: warm cream paper by day,
// a warm near-black desk by night. The page follows the visitor's system light/dark setting.
export const siteThemeMap = {
  light: {
    colourScheme: 'light',
    page: '#ebdcbd',
    ink: '#1c1714',
    muted: '#4d443a',
    accent: '#8a3c1f',
    line: '#1c171433',
    panel: '#1c17140d',
    frame: '#f7efdf',
    frameInk: '#1c1714',
    photoBackground: '#d6c3a1',
    photoShadow: '0 12px 26px -12px rgba(60, 40, 25, 0.5)',
    tapeOpacity: '0.85',
    lamp: 'rgba(240, 170, 110, 0.22)',
    grainOpacity: '0.45',
    selection: '#df9a73',
    selectionInk: '#1c1714'
  },
  dark: {
    colourScheme: 'dark',
    page: '#1d1916',
    ink: '#ecdfbf',
    muted: '#cfc6b6',
    accent: '#e8a57d',
    line: '#ecdfbf2e',
    panel: '#ecdfbf0f',
    frame: '#e8dcc2',
    frameInk: '#1c1714',
    photoBackground: '#cdb994',
    photoShadow: '0 14px 30px -10px rgba(0, 0, 0, 0.7)',
    tapeOpacity: '0.7',
    lamp: 'rgba(156, 72, 39, 0.28)',
    grainOpacity: '0.18',
    selection: '#9c4827',
    selectionInk: '#f7ecd6'
  }
}

// Category label colours (shared by both themes) and the matching washi-tape colours.
export const categoryToneMap = {
  rust: { background: '#9c4827', ink: '#f7ecd6', tape: 'rgba(223, 154, 115, 0.75)' },
  sage: { background: '#6d8577', ink: '#161412', tape: 'rgba(109, 133, 119, 0.6)' },
  tan: { background: '#ccba9b', ink: '#161412', tape: 'rgba(204, 186, 155, 0.8)' }
}

const createPropertyName = (tokenName) =>
  '--' + tokenName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export class SiteTheme {
  static createDeclarationBlock(theme) {
    return Object.entries(theme)
      .map(([tokenName, tokenValue]) =>
        tokenName === 'colourScheme'
          ? `color-scheme:${tokenValue}`
          : `${createPropertyName(tokenName)}:${tokenValue}`
      )
      .join(';')
  }

  static createToneDeclarationBlock() {
    return Object.entries(categoryToneMap)
      .flatMap(([toneName, tone]) => [
        `--tone-${toneName}:${tone.background}`,
        `--tone-${toneName}-ink:${tone.ink}`,
        `--tape-${toneName}:${tone.tape}`
      ])
      .join(';')
  }

  static createStyleSheet(themeMap = siteThemeMap) {
    return (
      `html:root{${this.createDeclarationBlock(themeMap.light)};${this.createToneDeclarationBlock()}}` +
      `@media (prefers-color-scheme: dark){html:root{${this.createDeclarationBlock(themeMap.dark)}}}`
    )
  }
}
