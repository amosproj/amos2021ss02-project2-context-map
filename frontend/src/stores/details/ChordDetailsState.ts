/**
 * Describes the state of the chord entity details to show.
 */
export interface ChordDetailsState {
  /**
   * Chord diagram data: type names and edges.
   */
  chordData: ChordData;

  /**
   * index of the node type to show relations of.
   */
  index?: number;
}
