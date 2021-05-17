import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { SearchResultOption } from './SearchResultOption';
import { SearchResult } from '../shared/search/SearchResult';
import { NodeTypeDescriptor } from '../shared/schema/NodeTypeDescriptor';
import { EdgeTypeDescriptor } from '../shared/schema/EdgeTypeDescriptor';

// TODO check the nodes/edges/types for a fitting representation in the options

function convertNodeToOption(node: NodeDescriptor): SearchResultOption {
  return {
    label: node.id.toString(),
    subLabel: '',
    type: typeof node,
  };
}

function convertEdgeToOption(edge: EdgeDescriptor): SearchResultOption {
  return {
    label: edge.id.toString(),
    subLabel: `${edge.from} -> ${edge.to}`,
    type: typeof edge,
  };
}

function convertTypeToOption(
  entityType: NodeTypeDescriptor | EdgeTypeDescriptor
): SearchResultOption {

  return {
    label: entityType.name,
    subLabel: '',
    type: typeof entityType,
  };
}

export default function convertSearchResultToOptions(
  result: SearchResult
): SearchResultOption[] {
  const resultOptions: SearchResultOption[] = [];

  const nodeOptions = result.nodes.map((node) => convertNodeToOption(node));
  const edgeOptions = result.edges.map((edge) => convertEdgeToOption(edge));
  const edgeTypeOptions = result.edgeTypes.map((edgeType) =>
    convertTypeToOption(edgeType)
  );
  const nodeTypeOptions = result.nodeTypes.map((nodeType) =>
    convertTypeToOption(nodeType)
  );

  resultOptions.push(
    ...nodeOptions,
    ...edgeOptions,
    ...nodeTypeOptions,
    ...edgeTypeOptions
  );

  return resultOptions;
}
