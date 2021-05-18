/**
 * Represents a option element inside the dropdown of the autocomplete search.
 */
export interface SearchResultEntry {
  label: string,
  value: string,
  subLabel: string,
  type: string,
  color?: string | undefined
}
