/**
 * Attributes used for visualisation of entities.
 */
export default interface EntityStyle {
  /**
   * Background color
   */
  color: string;

  /**
   * Border Attributes
   */
  border: { color: string };
}

export interface NodeStyle extends EntityStyle {
  text: { color: string };
}
