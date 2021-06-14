import { Edge, EdgeDescriptor } from '../shared/entities';
import {
  FilterCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

/**
 * An executor for edge filter conditions.
 */
export class EdgeFilterConditionExecutor extends FilterConditionVisitor {
  /**
   * Contains the filtered edges.
   */
  private edges: Edge[] = [];

  /**
   * Filters the specified collection of edges with the specified filter condition.
   * @param edges The collection of edges to filter.
   * @param filter The filter condition.
   * @returns The filtered collection of edge descriptors.
   */
  public filterEdges(edges: Edge[], filter: FilterCondition): EdgeDescriptor[] {
    this.edges = edges;
    this.visit(filter);
    return this.edges;
  }

  /**
   * Processes an of-type filter condition.
   */
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    // Filter the edges such that any of the edge types matches the type of the filter
    // and replace the current filtered edges.
    this.edges = this.edges.filter((edge) => edge.type === condition.type);

    return super.visitOfTypeCondition(condition);
  }

  /**
   * Processes a match-property condition.
   */
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    // Filter the edges such that the property (as specified in the filter) is present and has
    // the same value as specified by the filter. Replace the currently filtered edges.
    this.edges = this.edges.filter(
      (edge) =>
        edge.properties[condition.property] !== undefined &&
        edge.properties[condition.property] === condition.value
    );

    return super.visitMatchPropertyCondition(condition);
  }

  // We do not need to override the implementation of the match-all condition processing,
  // as the implementation of the base type is already doing what we expect.

  /**
   * Processes a match-any condition.
   */
  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    const filters: FilterCondition[] = [];
    const storedEdges = this.edges;
    const edges = new Map<number, Edge>();

    // This needs to remember the original collection of filtered edges in the `storedEdges` variable
    // and call all contained filter conditions with it.

    // walk through all contained filter conditions.
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      // Restore the edges, that we stored away before iterating of the filters.
      this.edges = storedEdges;

      // Execute the filter.
      filters.push(this.visit(filter));

      // Combine the results.
      // eslint-disable-next-line no-restricted-syntax
      for (const edge of this.edges) {
        if (!edges.has(edge.id)) {
          edges.set(edge.id, edge);
        }
      }
    }

    this.edges = [...edges.values()];
    return MatchAnyCondition(...filters);
  }
}
