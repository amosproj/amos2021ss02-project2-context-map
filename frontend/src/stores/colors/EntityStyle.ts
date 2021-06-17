/**
 * Described the stroke style of an entity.
 */
export interface EntityStrokeStyle {
  /**
   * The stroke with in pixel units.
   */
  width: number;
  /**
   * The dash-style. This is either a boolean value or an array that specified the length of the dashes.
   */
  dashes: boolean | number[];
}

/**
 * Attributes used for visualization of entities.
 */
export default interface EntityStyle {
  /**
   * The entity's desired  desired color.
   */
  color: string;
  /**
   * The entity's desired stroke style.
   */
  stroke: EntityStrokeStyle;
}

/**
 * Described the stroke style of a node.
 */
export interface NodeStrokeStyle extends EntityStrokeStyle {
  /**
   * The node's desired stroke color.
   */
  color: string;
}

/**
 * Described the text style of a node.
 */
export interface NodeTextStyle {
  /**
   * The node's desired text color.
   */
  color: string;
}

/**
 * Attributes used for visualization of nodes.
 */
export interface NodeStyle extends EntityStyle {
  /**
   * The node's desired text style.
   */
  text: NodeTextStyle;

  /**
   * The node's desired stroke style.
   */
  stroke: NodeStrokeStyle;
}

/**
 * Attributes used for visualization of edges.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EdgeStyle extends EntityStyle {}
