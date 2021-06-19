import { EntityTypeDescriptor } from './EntityTypeDescriptor';

/**
 * A descriptor of an edge type.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EdgeTypeDescriptor extends EntityTypeDescriptor {
  /**
   * Used to identify if an object of this type corresponds to an EdgeTypeDescriptor
   */
  edge: undefined
}
