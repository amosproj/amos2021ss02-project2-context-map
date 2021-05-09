// TODO: This is copied from the backend, use code-sharing instead!
/**
 * Describes an simple edge of a graph.
 */
 export interface EdgeDescriptor {
    id: number;
    /**
     * ID of the start node
     */
    from: number;
    /**
     * ID of the end node
     */
    to: number;
  }