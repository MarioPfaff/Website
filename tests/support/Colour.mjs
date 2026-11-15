// Colour maths for the theme tests: WCAG 2 contrast ratio and APCA lightness contrast.
export class Colour {
  static mix(firstColour, secondColour, secondWeight) {
    const channelCollection = [1, 3, 5].map((channelOffset) => {
      const firstChannel = Number.parseInt(firstColour.slice(channelOffset, channelOffset + 2), 16)
      const secondChannel = Number.parseInt(
        secondColour.slice(channelOffset, channelOffset + 2),
        16
      )
      return Math.round(firstChannel * (1 - secondWeight) + secondChannel * secondWeight)
        .toString(16)
        .padStart(2, '0')
    })
    return `#${channelCollection.join('')}`
  }

  static getLuminance(colour) {
    const channelCollection = [1, 3, 5].map((channelOffset) => {
      const channel = Number.parseInt(colour.slice(channelOffset, channelOffset + 2), 16) / 255
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return (
      channelCollection[0] * 0.2126 + channelCollection[1] * 0.7152 + channelCollection[2] * 0.0722
    )
  }

  static getContrastRatio(firstColour, secondColour) {
    const [lighter, darker] = [
      Colour.getLuminance(firstColour),
      Colour.getLuminance(secondColour)
    ].sort((first, second) => second - first)
    return (lighter + 0.05) / (darker + 0.05)
  }

  // APCA 0.0.98G lightness contrast (Lc) for text on a background; sign shows polarity.
  static getApcaContrast(textColour, backgroundColour) {
    const getScreenLuminance = (colour) => {
      const [red, green, blue] = [1, 3, 5].map(
        (channelOffset) =>
          (Number.parseInt(colour.slice(channelOffset, channelOffset + 2), 16) / 255) ** 2.4
      )
      const luminance = 0.2126729 * red + 0.7151522 * green + 0.072175 * blue
      return luminance > 0.022 ? luminance : luminance + (0.022 - luminance) ** 1.414
    }
    const textLuminance = getScreenLuminance(textColour)
    const backgroundLuminance = getScreenLuminance(backgroundColour)
    if (backgroundLuminance > textLuminance) {
      const contrast = (backgroundLuminance ** 0.56 - textLuminance ** 0.57) * 1.14
      return contrast < 0.1 ? 0 : (contrast - 0.027) * 100
    }
    const contrast = (backgroundLuminance ** 0.65 - textLuminance ** 0.62) * 1.14
    return contrast > -0.1 ? 0 : (contrast + 0.027) * 100
  }
}
