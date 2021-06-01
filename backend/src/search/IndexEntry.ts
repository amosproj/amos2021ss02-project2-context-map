import { RestoredIndexEntry } from './RestoredIndexEntry';

export interface IndexEntry extends RestoredIndexEntry {
  /**
   * Contains the type of entity, that is the type of edge or the combined types of the node if the entry represents an entity,
   * or the name of the entity-type if the entry represents an entity-type.
   */
  type?: string;

  /**
   * Contains the properties of the entry.
   */
  properties: IndexEntryProperties;
}

/**
 * Represents the properties of an index-entry.
 */
export interface IndexEntryProperties {
  /**
   * Gets or sets a property of an index entry.
   */
  [key: string]: string | undefined;
}
