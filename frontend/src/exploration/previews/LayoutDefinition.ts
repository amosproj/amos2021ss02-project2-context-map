/**
 * Used to construct the {@link LayoutCard}s.
 */
export default interface LayoutDefinition {
  /**
   * Name of the image file.
   */
  filename: string;

  /**
   * Description that is placed under the image.
   */
  description: string;

  /**
   * Path the preview routes to.
   */
  path: string;
}
