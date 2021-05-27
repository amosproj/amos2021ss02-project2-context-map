import any from '../utils/any';
import { Node, NodeDescriptor } from '../shared/entities';
import {
  FilterCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

export class NodeFilterConditionExecutor extends FilterConditionVisitor {
  private nodes: Node[] = [];

  public filterNodes(nodes: Node[], filter: FilterCondition): NodeDescriptor[] {
    this.nodes = nodes;
    this.visit(filter);
    return this.nodes;
  }

  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    this.nodes = this.nodes.filter((node) =>
      any(node.types, (type) => type === condition.type)
    );

    return super.visitOfTypeCondition(condition);
  }

  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    this.nodes = this.nodes.filter(
      (node) =>
        node.properties[condition.property] !== undefined &&
        node.properties[condition.property] === condition.value
    );

    return super.visitMatchPropertyCondition(condition);
  }

  protected visitMatchAnyCondition(
    condition: MatchAnyCondition
  ): FilterCondition {
    const filters: FilterCondition[] = [];
    const storedNodes = this.nodes;
    const nodes = new Map<number, Node>();

    // eslint-disable-next-line no-restricted-syntax
    for (const filter of condition.filters) {
      // Restore the nodes, that we stored away before iterating of the filters.
      this.nodes = storedNodes;

      // Execute the filter.
      filters.push(this.visit(filter));

      // Combine the results.
      // eslint-disable-next-line no-restricted-syntax
      for (const node of this.nodes) {
        if (!nodes.has(node.id)) {
          nodes.set(node.id, node);
        }
      }
    }

    this.nodes = [...nodes.values()];
    return MatchAnyCondition(...filters);
  }
}
