import { Edge as VisEdge, Node as VisNode } from 'vis-network';
import { GraphData } from 'react-graph-vis';
import { QueryEdgeResult, QueryResult } from '../../shared/queries';
import { EntityStyleProvider } from '../../stores/colors';
import QueryNodeResult from '../../shared/queries/QueryNodeResult';
import { edgeStyle, nodeStyle } from './entityStyle';

function styleSchemaEdge(
  edge: QueryEdgeResult,
  styleProvider: EntityStyleProvider
): VisEdge {
  const style = edgeStyle(styleProvider.getStyle(edge));

  return { ...edge, label: edge.type, ...style };
}

function styleSchemaNode(
  node: QueryNodeResult,
  styleProvider: EntityStyleProvider
): VisNode {
  const style = nodeStyle(styleProvider.getStyle(node));

  return { ...node, label: node.types[0], ...style };
}

/**
 * Styles a query result containing a meta graph.
 */
export default function styleSchemaQueryResult(
  schema: QueryResult,
  styleProvider: EntityStyleProvider
): GraphData {
  return {
    nodes: schema.nodes.map((node) => styleSchemaNode(node, styleProvider)),
    edges: schema.edges.map((edge) => styleSchemaEdge(edge, styleProvider)),
  };
}
