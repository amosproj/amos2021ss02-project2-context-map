/**
 * Represents a option element inside the dropdown of the autocomplete search.
 */
export interface SearchResultOption {
  label: string,
  subLabel: string,
  type: string,
  color?: string | undefined
}