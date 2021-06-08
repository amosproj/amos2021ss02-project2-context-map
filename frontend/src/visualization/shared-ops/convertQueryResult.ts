import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { QueryNodeResult, QueryResult } from '../../shared/queries';
import { EntityStyleProvider, NodeStyle } from '../../stores/colors';

function convertNode(
  node: QueryNodeResult,
  styleProvider: EntityStyleProvider
): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    color: {
      border: (styleProvider(node) as NodeStyle).border.color, // TODO: This should be infered automatically
      background: styleProvider(node).color,
    },
  };

  if (node.subsidiary) {
    result.color = 'yellow';
  }

  return result;
}

function convertNodes(
  nodes: QueryNodeResult[],
  styleProvider: EntityStyleProvider
): vis.Node[] {
  return nodes.map((node) => convertNode(node, styleProvider));
}

function convertEdge(
  edge: EdgeDescriptor,
  styleProvider: EntityStyleProvider
): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: styleProvider(edge).color,
  };
}

function convertEdges(
  edges: EdgeDescriptor[],
  styleProvider: EntityStyleProvider
): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge, styleProvider));
}

export default function convertQueryResult(
  queryResult: QueryResult,
  styleProvider: EntityStyleProvider
): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes, styleProvider),
    edges: convertEdges(queryResult.edges, styleProvider),
  };
}
