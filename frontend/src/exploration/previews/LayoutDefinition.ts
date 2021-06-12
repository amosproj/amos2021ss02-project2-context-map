import TabDefinition from '../../routing/TabDefinition';

/**
 * Data that is used to construct the {@link LayoutCard}s.
 */
export default interface LayoutDefinition extends TabDefinition {
  /**
   * Used for searching the corresponding tab label.
   */
  label: string;

  /**
   * Name of the image file without file extension.
   */
  filename: string;

  /**
   * Description that is placed under the image.
   */
  description: string;
}
