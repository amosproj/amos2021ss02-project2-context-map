import { any } from '../utils';
import { Node, NodeDescriptor } from '../shared/entities';
import {
  FilterCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../shared/queries';
import FilterConditionVisitor from './FilterConditionVisitor';

/**
 * An executor for node filter conditions.
 */
export class NodeFilterConditionExecutor extends FilterConditionVisitor {
  /**
   * Contains the filtered nodes.
   */
  private nodes: Node[] = [];

  /**
   * Filters the specified collection of nodes with the specified filter condition.
   * @param nodes The collection of nodes to filter.
   * @param filter The filter condition.
   * @returns The filtered collection of node descriptors.
   */
  public filterNodes(nodes: Node[], filter: FilterCondition): NodeDescriptor[] {
    this.nodes = nodes;
    this.visit(filter);
    return this.nodes;
  }

  /**
   * Processes an of-type filter condition.
   */
  protected visitOfTypeCondition(condition: OfTypeCondition): FilterCondition {
    // Filter the nodes such that any of the node types matched the type of the filter
    // and replace the current filtered nodes.
    this.nodes = this.nodes.filter((node) =>
      any(node.types, (type) => type === condition.type)
    );

    return super.visitOfTypeCondition(condition);
  }

  /**
   * Processes a match-property condition.
   */
  protected visitMatchPropertyCondition(
    condition: MatchPropertyCondition
  ): FilterCondition {
    // Filter the nodes such that the property (as specified in the filter) is present and has
    // the same value as specified by the filter. Replace the currently filtered nodes.
    this.nodes = this.nodes.filter(
      (node) =>
        node.properties[condition.property] !== undefined &&
        node.properties[condition.property] === condition.value
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
    const storedNodes = this.nodes;
    const nodes = new Map<number, Node>();

    // This needs to remember the original collection of filtered nodes in the `storedNodes` variable
    // and call all contained filter conditions with it.

    // walk through all contained filter conditions.
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
