/**
 * Attributes used for visualisation of entities.
 */
export default interface EntityVisualisationAttributes {
  /**
   * Background color
   */
  color: string;
}

export interface NodeVisualisationAttributes
  extends EntityVisualisationAttributes {
  /**
   * Border Attributes
   */
  border: { color: string };
}
