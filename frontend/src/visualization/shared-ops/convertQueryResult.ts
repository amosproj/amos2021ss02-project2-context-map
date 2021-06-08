import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { QueryNodeResult, QueryResult } from '../../shared/queries';
import { EntityStyleProvider } from '../../stores/colors';

function convertNode(
  node: QueryNodeResult,
  colorize: EntityStyleProvider
): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    color: colorize(node).color,
  };

  if (node.subsidiary) {
    result.color = 'yellow';
  }

  return result;
}

function convertNodes(
  nodes: QueryNodeResult[],
  colorize: EntityStyleProvider
): vis.Node[] {
  return nodes.map((node) => convertNode(node, colorize));
}

function convertEdge(
  edge: EdgeDescriptor,
  colorize: EntityStyleProvider
): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: colorize(edge).color,
  };
}

function convertEdges(
  edges: EdgeDescriptor[],
  colorize: EntityStyleProvider
): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge, colorize));
}

export default function convertQueryResult(
  queryResult: QueryResult,
  colorize: EntityStyleProvider
): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes, colorize),
    edges: convertEdges(queryResult.edges, colorize),
  };
}
