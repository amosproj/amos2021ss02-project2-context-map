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
import createDummyEdgeFromType from './createDummyEdgeFromType';
import createDummyNodeFromType from './createDummyNodeFromType';

function convertNodeType(
  nodeType: NodeType,
  styleProvider: EntityStyleProvider
) {
  const style = nodeStyle(
    styleProvider.getStyle(createDummyNodeFromType(nodeType))
  );

  const nodeTypeInfo = {
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
    styleProvider.getStyle(createDummyEdgeFromType(edgeType))
  );

  const edgeTypeInfo = {
    id: edgeType.name,
    label: edgeType.name,
    from: nodeTypeConnectionInfo.from,
    to: nodeTypeConnectionInfo.to,
  };

  return { ...edgeTypeInfo, ...style };
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

/**
 * Converts a {@link Schema}, given the styles provided by an {@link EntityStyleProvider}, to
 * data, Vis can interpret.
 *
 * @param schema - schema to be converted.
 * @param styleProvider - applies styles to the {@link GraphData} result.
 */
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
