import { EntityTypeProperty } from './EntityTypeProperty';

/**
 * Entity type of a graph.
 */
export interface EntityType {
  /**
   * Name of the entity type
   */
  name: string;
  /**
   * Attributes of the entity type
   */
  properties: EntityTypeProperty[];
}
