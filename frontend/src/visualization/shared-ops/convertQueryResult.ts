import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import {
  QueryEdgeResult,
  QueryNodeResult,
  QueryResult,
} from '../../shared/queries';
import { EdgeStyle, EntityStyleProvider, NodeStyle } from '../../stores/colors';
import { EdgeType, NodeType } from '../../shared/schema';
import { Schema } from '../../stores/SchemaStore';

function nodeStyle(style: NodeStyle) {
  return {
    color: {
      border: style.stroke.color,
      background: style.color,
    },
    borderWidth: style.stroke.width,
    shapeProperties: {
      borderDashes: style.stroke.dashes,
    },
  };
}

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

function convertNodeType(
  nodeType: NodeType,
  styleProvider: EntityStyleProvider
) {
  const style = nodeStyle(
    styleProvider.getStyle({ id: -1, types: [nodeType.name] })
  );

  const nodeTypeInfo: vis.Node = {
    id: nodeType.name,
    label: nodeType.name,
  };

  return { ...nodeTypeInfo, ...style };
}
function convertNodes(
  nodes: QueryNodeResult[],
  styleProvider: EntityStyleProvider
): vis.Node[] {
  return nodes.map((node) => convertNode(node, styleProvider));
}

function convertNodeTypes(
  nodeTypes: NodeType[],
  styleProvider: EntityStyleProvider
): vis.Node[] {
  return nodeTypes.map((nodeType) => convertNodeType(nodeType, styleProvider));
}

function edgeStyle(style: EdgeStyle) {
  return {
    color: style.color,
    dashes: style.stroke.dashes,
    width: style.stroke.width,
  };
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

function convertEdgeType(
  edgeType: EdgeType,
  styleProvider: EntityStyleProvider
): vis.Edge {
  const style = edgeStyle(
    styleProvider.getStyle({ id: -1, type: edgeType.name, from: -1, to: -1 })
  );

  const edgeInfo = {
    id: edgeType.name,
    from: -1,
    to: -1,
  };

  return { ...edgeInfo, ...style };
}

function convertEdges(
  edges: QueryEdgeResult[],
  styleProvider: EntityStyleProvider
): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge, styleProvider));
}

function convertEdgeTypes(
  edgeTypes: EdgeType[],
  styleProvider: EntityStyleProvider
): vis.Edge[] {
  return edgeTypes.map((edgeType) => convertEdgeType(edgeType, styleProvider));
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

export function convertSchema(
  schema: Schema,
  styleProvider: EntityStyleProvider
): GraphData {
  return {
    nodes: convertNodeTypes(schema.nodeTypes, styleProvider),
    edges: convertEdgeTypes(schema.edgeTypes, styleProvider),
  };
}
