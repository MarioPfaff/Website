export type TapeColour = 'rust' | 'sage' | 'tan'
export type TapePosition = 'middle' | 'corner'

export interface PolaroidPlacement {
  tilt: number
  tape: TapeColour
  tapePosition: TapePosition
}

const tiltCollection = [-2, 1.5, -1, 2.5]
const tapeCollection: TapeColour[] = ['sage', 'rust', 'tan']

// Photos in a row get slightly different tilts and tape, like prints stuck in by hand,
// but always the same ones for the same position so the page doesn't change between visits.
export function usePolaroid() {
  function getPlacement(photoIndex: number): PolaroidPlacement {
    return {
      tilt: tiltCollection[photoIndex % tiltCollection.length],
      tape: tapeCollection[photoIndex % tapeCollection.length],
      tapePosition: photoIndex % 2 ? 'corner' : 'middle'
    }
  }

  return { getPlacement }
}
