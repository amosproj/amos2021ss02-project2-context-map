export interface EntityStrokeStyle {
  width: number;
  dashes: boolean | number[];
}

/**
 * Attributes used for visualisation of entities.
 */
export default interface EntityStyle {
  /**
   * Background color
   */
  color: string;
  stroke: EntityStrokeStyle;
}

export interface NodeStyle extends EntityStyle {
  text: { color: string };

  /**
   * Border Attributes
   */
  border: { color: string };
}
