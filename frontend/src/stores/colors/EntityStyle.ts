/**
 * Attributes used for visualisation of entities.
 */
export default interface EntityStyle {
  /**
   * Background color
   */
  color: string;
}

export interface NodeStyle extends EntityStyle {
  /**
   * Border Attributes
   */
  border: { color: string };
  text: { color: string };
}
