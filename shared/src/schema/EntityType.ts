import { EntityTypeDescriptor } from './EntityTypeDescriptor';
import { EntityTypeProperty } from './EntityTypeProperty';

/**
 * Entity type of a graph.
 */
export interface EntityType extends EntityTypeDescriptor {
  /**
   * Attributes of the entity type
   */
  properties: EntityTypeProperty[];
}
