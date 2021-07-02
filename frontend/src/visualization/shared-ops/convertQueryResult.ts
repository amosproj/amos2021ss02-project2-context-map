import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import {
  QueryEdgeResult,
  QueryNodeResult,
  QueryResult,
} from '../../shared/queries';
import { EntityStyleProvider } from '../../stores/colors';
import { edgeStyle, nodeStyle } from './entityStyle';

function convertNode(
  node: QueryNodeResult,
  styleProvider: EntityStyleProvider
): vis.Node {
  const style = nodeStyle(styleProvider.getStyle(node));

  const nodeInfo: vis.Node = {
    id: node.id,
    label: node.id.toString(),
  };

  return { ...nodeInfo, ...style };
}

function convertNodes(
  nodes: QueryNodeResult[],
  styleProvider: EntityStyleProvider
): vis.Node[] {
  return nodes.map((node) => convertNode(node, styleProvider));
}

function convertEdge(
  edge: QueryEdgeResult,
  styleProvider: EntityStyleProvider
): vis.Edge {
  const style = edgeStyle(styleProvider.getStyle(edge));

  const edgeInfo = {
    id: edge.id,
    from: edge.from,
    to: edge.to,
  };

  return { ...edgeInfo, ...style };
}

function convertEdges(
  edges: QueryEdgeResult[],
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
