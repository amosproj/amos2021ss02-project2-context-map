import { Edge } from '../shared/entities/Edge';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import {
  FilterCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

export class EdgeFilterConditionExecutor extends FilterConditionVisitor {
  private edges: Edge[] = [];

  public filterEdges(edges: Edge[], filter: FilterCondition): EdgeDescriptor[] {
    this.edges = edges;
    this.visit(filter);
    return this.edges;
  }

  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    this.edges = this.edges.filter((edge) => edge.type === condition.type);

    return super.visitOfTypeCondition(condition);
  }

  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    this.edges = this.edges.filter(
      (edge) =>
        edge.properties[condition.property] !== undefined &&
        edge.properties[condition.property] === condition.value
    );

    return super.visitMatchPropertyCondition(condition);
  }

  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    const filters: FilterCondition[] = [];
    const storedEdges = this.edges;
    const edges = new Map<number, Edge>();

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
