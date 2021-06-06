import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { NodeResultDescriptor, QueryResult } from '../../shared/queries';
import { NodeColorizer, EdgeColorizer } from '../../stores/colors';

function convertNode(
  node: NodeResultDescriptor,
  colorize: NodeColorizer
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
  nodes: NodeResultDescriptor[],
  colorize: NodeColorizer
): vis.Node[] {
  return nodes.map((node) => convertNode(node, colorize));
}

function convertEdge(edge: EdgeDescriptor, colorize: EdgeColorizer): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: colorize(edge).color,
  };
}

function convertEdges(
  edges: EdgeDescriptor[],
  colorize: EdgeColorizer
): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge, colorize));
}

export default function convertQueryResult(
  queryResult: QueryResult,
  colorizeNodes: NodeColorizer,
  colorizeEdges: EdgeColorizer
): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes, colorizeNodes),
    edges: convertEdges(queryResult.edges, colorizeEdges),
  };
}
