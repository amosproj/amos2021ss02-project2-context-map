import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { QueryNodeResult, QueryResult } from '../../shared/queries';
import { EntityStyleProvider, NodeStyle } from '../../stores/colors';

function convertNode(
  node: QueryNodeResult,
  styleProvider: EntityStyleProvider
): vis.Node {
  // TODO: This should be infered automatically
  const style = styleProvider(node) as NodeStyle;

  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    color: {
      border: style.stroke.color,
      background: style.color,
    },
    borderWidth: style.stroke.width,
    shapeProperties: {
      borderDashes: style.stroke.dashes,
    },
  };

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
  const style = styleProvider(edge);

  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: style.color,
    dashes: style.stroke.dashes,
    width: style.stroke.width,
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
