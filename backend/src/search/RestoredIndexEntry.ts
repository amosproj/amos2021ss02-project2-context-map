export interface RestoredIndexEntry {
  /**
   * Contains the type of index entry.
   */
  entityType: 'node' | 'edge' | 'node-type' | 'edge-type';

  /**
   * Contains the id of the entity or the name of the entity type.
   */
  id: number | string;

  /**
   * Contains the id of the from node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  from?: number;

  /**
   * Contains the id of the to node of the edge, if {@link entityType} is 'edge', {@code undefined} otherwise.
   */
  to?: number;
}
