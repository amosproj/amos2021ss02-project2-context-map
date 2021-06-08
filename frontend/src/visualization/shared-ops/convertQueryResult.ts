import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { QueryNodeResult, QueryResult } from '../../shared/queries';
import { EntityColorizer } from '../../stores/colors';

function convertNode(
  node: QueryNodeResult,
  colorizer: EntityColorizer
): vis.Node {
  return {
    id: node.id,
    label: node.id.toString(),
    color: colorizer.colorize(node).color,
  };
}

function convertNodes(
  nodes: QueryNodeResult[],
  colorize: EntityColorizer
): vis.Node[] {
  return nodes.map((node) => convertNode(node, colorize));
}

function convertEdge(
  edge: EdgeDescriptor,
  colorizer: EntityColorizer
): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: colorizer.colorize(edge).color,
  };
}

function convertEdges(
  edges: EdgeDescriptor[],
  colorize: EntityColorizer
): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge, colorize));
}

export default function convertQueryResult(
  queryResult: QueryResult,
  colorize: EntityColorizer
): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes, colorize),
    edges: convertEdges(queryResult.edges, colorize),
  };
}
