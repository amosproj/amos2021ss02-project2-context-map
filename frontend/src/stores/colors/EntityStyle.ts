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

export interface NodeStrokeStyle extends EntityStrokeStyle {
  color: string;
}

export interface NodeStyle extends EntityStyle {
  text: { color: string };

  /**
   * Border Attributes
   */
  stroke: NodeStrokeStyle;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EdgeStyle extends EntityStyle {}
