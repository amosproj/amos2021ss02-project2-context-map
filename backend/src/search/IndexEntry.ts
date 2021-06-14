export interface IndexEntry {
  /**
   * Contains the type of index entry.
   */
  entityType: 'node' | 'edge' | 'node-type' | 'edge-type';

  /**
   * Contains the id of the entity or the name of the entity type.
   */
  id: number | string;

  /**
   * Contains the id node-types if {@link entityType} is 'node', a single entry that is the edge-type, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  types?: string[];

  /**
   * Contains the id of the from node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  from?: number;

  /**
   * Contains the id of the to node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  to?: number;

  /**
   * Contains the key of the indexed string.
   * This is
   * properties.{property-name} if a property is indexed
   * type if the entity is is indexed
   * id if the id of the entity or the name of the entity-type is indexed.
   */
  indexKey?: string;

  /**
   * Contains the string value that is indexed.
   */
  indexValue: string;
}
