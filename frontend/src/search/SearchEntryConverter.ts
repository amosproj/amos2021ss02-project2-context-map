import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { SearchResultEntry } from './SearchResultEntry';
import { SearchResult } from '../shared/search/SearchResult';
import { NodeTypeDescriptor } from '../shared/schema/NodeTypeDescriptor';
import { EdgeTypeDescriptor } from '../shared/schema/EdgeTypeDescriptor';
import { SearchResultEntryGroup } from './SearchResultEntryGroup';

// TODO check the nodes/edges/types for a fitting representation in the options

function convertNodeToEntry(node: NodeDescriptor): SearchResultEntry {
  return {
    label: node.id.toString(),
    value: node.id.toString(),
  };
}

function convertEdgeToEntry(edge: EdgeDescriptor): SearchResultEntry {
  return {
    label: `${edge.from} -> ${edge.to}`,
    value: edge.id.toString(),
  };
}

function convertEdgeTypeToEntry(
  entityType: EdgeTypeDescriptor
): SearchResultEntry {
  return {
    label: entityType.name,
    value: entityType.name,
  };
}

function convertNodeTypeToEntry(
  entityType: NodeTypeDescriptor
): SearchResultEntry {
  return {
    label: entityType.name,
    value: entityType.name,
  };
}

function createEntryGroup(label: string, options: SearchResultEntry[]) {
  return {
    label,
    options,
  };
}

export default function convertSearchResultToEntryGroups(
  result: SearchResult | undefined
): SearchResultEntryGroup[] {
  const entryGroups: SearchResultEntryGroup[] = [];

  if (result !== undefined) {
    const nodeEntries = result.nodes.map((node) => convertNodeToEntry(node));
    const edgeEntries = result.edges.map((edge) => convertEdgeToEntry(edge));
    const nodeTypeEntries = result.nodeTypes.map((nodeType) =>
      convertNodeTypeToEntry(nodeType)
    );
    const edgeTypeEntries = result.edgeTypes.map((edgeType) =>
      convertEdgeTypeToEntry(edgeType)
    );

    entryGroups.push(createEntryGroup('nodes', nodeEntries));
    entryGroups.push(createEntryGroup('edges', edgeEntries));
    entryGroups.push(createEntryGroup('nodeTypes', nodeTypeEntries));
    entryGroups.push(createEntryGroup('edgeTypes', edgeTypeEntries));
  }

  return entryGroups;
}
