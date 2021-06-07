/**
 * State of a property whose values are chosen in {@link FilterLineProperty}
 */
export interface FilterPropertyState {
  /**
   * Name of the property
   */
  name: string;

  /**
   * State of the values
   */
  values: string[];
}

/**
 * State of a filter line
 */
export interface FilterLineState {
  /**
   * Entity type of the filter line
   */
  type: string;

  /**
   * Signals if this filter line is to be added to the {@link FilterQueryStore}
   */
  isActive: boolean;

  /**
   * States of the properties
   */
  propertyFilters: FilterPropertyState[];
}

/**
 * State of a filter
 */
export interface FilterState {
  /**
   * States of the filter lines of the nodes
   */
  edges: FilterLineState[];

  /**
   * States of the filter lines of the edges
   */
  nodes: FilterLineState[];
}
