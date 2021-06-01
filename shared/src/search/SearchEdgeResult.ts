import { EdgeDescriptor } from '../entities/EdgeDescriptor';

/**
 * Represents a search edge result.
 */
export interface SearchEdgeResult extends EdgeDescriptor {
  /**
   * The properties that contain the search string.
   */
  properties?: {
    [key: string]: string | undefined;
  };

  /**
   * The unique name of the type of the edge.
   */
  type: string;
}
