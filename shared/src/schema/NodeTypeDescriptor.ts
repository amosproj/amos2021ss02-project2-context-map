import { EntityTypeDescriptor } from './EntityTypeDescriptor';

/**
 * A descriptor of a node type.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeTypeDescriptor extends EntityTypeDescriptor {
  /**
   * Used to identify if an object of this type corresponds to an NodeTypeDescriptor
   */
  node: undefined
}
