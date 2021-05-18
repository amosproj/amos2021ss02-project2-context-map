import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { SearchResultEntry } from './SearchResultEntry';
import { SearchResult } from '../shared/search/SearchResult';
import { NodeTypeDescriptor } from '../shared/schema/NodeTypeDescriptor';
import { EdgeTypeDescriptor } from '../shared/schema/EdgeTypeDescriptor';

// TODO check the nodes/edges/types for a fitting representation in the options

function convertNodeToEntry(node: NodeDescriptor): SearchResultEntry {
  return {
    label: node.id.toString(),
    value: node.id.toString(),
    subLabel: '',
    type: 'node',
  };
}

function convertEdgeToEntry(edge: EdgeDescriptor): SearchResultEntry {
  return {
    label: edge.id.toString(),
    subLabel: `${edge.from} -> ${edge.to}`,
    value: edge.id.toString(),
    type: 'edge',
  };
}

function convertTypeToEntry(
  entityType: NodeTypeDescriptor | EdgeTypeDescriptor
): SearchResultEntry {
  return {
    label: entityType.name,
    value: entityType.name,
    subLabel: '',
    type: 'entity',
  };
}

export default function convertSearchResultToEntries(
  result: SearchResult | undefined
): SearchResultEntry[] {
  const resultEntries: SearchResultEntry[] = [];

  console.log(result);
  if (result !== undefined) {
    const nodeEntries = result.nodes.map((node) => convertNodeToEntry(node));
    const edgeEntries = result.edges.map((edge) => convertEdgeToEntry(edge));
    const nodeTypeEntries = result.nodeTypes.map((nodeType) =>
      convertTypeToEntry(nodeType)
    );
    const edgeTypeEntries = result.edgeTypes.map((edgeType) =>
      convertTypeToEntry(edgeType)
    );

    resultEntries.push(
      ...nodeEntries,
      ...edgeEntries,
      ...nodeTypeEntries,
      ...edgeTypeEntries
    );
  }

  return resultEntries;
}
