import { EntityTypeAttribute } from './EntityTypeAttribute';

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
  attributes: EntityTypeAttribute[];
}
