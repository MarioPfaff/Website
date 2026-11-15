export type TapeColour = 'rust' | 'sage' | 'tan'
export type TapePosition = 'middle' | 'corner'

export interface PolaroidPlacement {
  tilt: number
  tape: TapeColour
  tapePosition: TapePosition
}

type NonEmptyCollection<Item> = readonly [Item, ...Item[]]

const tiltCollection: NonEmptyCollection<number> = [-2, 1.5, -1, 2.5]
const tapeCollection: NonEmptyCollection<TapeColour> = ['sage', 'rust', 'tan']

// Cycles through a list: position 0 gets the first item, and so on, starting over at the end.
function pickInTurn<Item>(itemCollection: NonEmptyCollection<Item>, position: number) {
  return itemCollection[position % itemCollection.length] ?? itemCollection[0]
}

// Photos in a row get slightly different tilts and tape, like prints stuck in by hand,
// but always the same ones for the same position so the page doesn't change between visits.
export function usePolaroid() {
  function getPlacement(photoIndex: number): PolaroidPlacement {
    return {
      tilt: pickInTurn(tiltCollection, photoIndex),
      tape: pickInTurn(tapeCollection, photoIndex),
      tapePosition: photoIndex % 2 ? 'corner' : 'middle'
    }
  }

  return { getPlacement }
}
