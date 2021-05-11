import { EdgeDescriptor } from '../entities/EdgeDescriptor';
import { NodeDescriptor } from '../entities/NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export class QueryResult {
  public constructor() {
    this.nodes = [];
    this.edges = [];
  }

  nodes: NodeDescriptor[];
  edges: EdgeDescriptor[];
}
