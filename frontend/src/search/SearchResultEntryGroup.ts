import { SearchResultEntry } from './SearchResultEntry';

/**
 * Represents a group of option elements inside the dropdown of the autocomplete search.
 * The groups are separated by the type of search results (node, edge, node-type, edge-type)
 */

export interface SearchResultEntryGroup {
  /**
   * group label that is visible to the user
   */
  label: string,
  /**
   * grouped options based on their type
   */
  options: SearchResultEntry[],
}
