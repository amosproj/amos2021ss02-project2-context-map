// TODO: This is copied from the backend, use code-sharing instead!
import { EdgeDescriptor } from '../EdgeDescriptor';
import { NodeDescriptor } from '../NodeDescriptor';

/**
 * Generic Result of an API Query
 */
export class QueryResult {
  public constructor() {
    this.nodes = [];
    this.edges = [];
  }

  public nodes: NodeDescriptor[];
  public edges: EdgeDescriptor[];
}