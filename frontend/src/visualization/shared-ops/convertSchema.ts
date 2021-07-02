import * as vis from 'vis-network';
import { GraphData } from 'react-graph-vis';
import {
  EdgeType,
  NodeType,
  NodeTypeConnectionInfo,
} from '../../shared/schema';
import { EntityStyleProvider } from '../../stores/colors';
import { edgeStyle, nodeStyle } from './entityStyle';
import { Schema } from '../../stores/SchemaStore';

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

function convertNodeTypes(
  nodeTypes: NodeType[],
  styleProvider: EntityStyleProvider
): vis.Node[] {
  return nodeTypes.map((nodeType) => convertNodeType(nodeType, styleProvider));
}

function convertEdgeType(
  edgeType: EdgeType,
  nodeTypeConnectionInfo: NodeTypeConnectionInfo,
  styleProvider: EntityStyleProvider
): vis.Edge {
  const style = edgeStyle(
    styleProvider.getStyle({ id: -1, type: edgeType.name, from: -1, to: -1 })
  );

  const edgeInfo = {
    id: edgeType.name,
    from: nodeTypeConnectionInfo.from,
    to: nodeTypeConnectionInfo.to,
  };

  return { ...edgeInfo, ...style };
}

function convertEdgeTypes(
  edgeTypes: EdgeType[],
  nodeTypeConnectionInfos: NodeTypeConnectionInfo[],
  styleProvider: EntityStyleProvider
): vis.Edge[] {
  return edgeTypes.map((edgeType, index) =>
    convertEdgeType(edgeType, nodeTypeConnectionInfos[index], styleProvider)
  );
}

export default function convertSchema(
  schema: Schema,
  styleProvider: EntityStyleProvider
): GraphData {
  return {
    nodes: convertNodeTypes(schema.nodeTypes, styleProvider),
    edges: convertEdgeTypes(
      schema.edgeTypes,
      schema.nodeTypeConnectionInfos,
      styleProvider
    ),
  };
}
