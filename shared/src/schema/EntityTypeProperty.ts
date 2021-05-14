/**
 * Attributes of a entity type.
 * Contains descriptive information about an entity type.
 */
export interface EntityTypeProperty {
  /**
   * Name of the attribute
   */
  name: string;
  /**
   * Possible data types of the attribute.
   */
  types: ("Long" | "String" | "StringArray" | string)[];
  /**
   * If true, this attribute cannot be null
   */
  mandatory: boolean;
}
