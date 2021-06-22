import React from 'react';
import SearchResultList from './SearchResultList';
import {
  SearchEdgeResult,
  SearchNodeResult,
  SearchResult,
} from '../shared/search';
import NodeTypeComponent from './helper/NodeTypeComponent';
import EdgeTypeComponent from './helper/EdgeTypeComponent';
import { EntityStyleProvider } from '../stores/colors';

function formatEntry(resultEntry: SearchNodeResult | SearchEdgeResult) {
  let result = `[${resultEntry.id}]`;

  if (resultEntry.properties) {
    for (const key of Object.keys(resultEntry.properties)) {
      const value = resultEntry.properties[key];
      result += ` { ${key}: ${value} }`;
    }
  }

  return result;
}

export default function convertSearchResultToSearchResultList(
  searchString: string,
  result: SearchResult | undefined,
  styleProvider: EntityStyleProvider
): SearchResultList[] {
  /* istanbul ignore if */
  if (result === undefined) {
    return [];
  }

  return [
    {
      key: 'Nodes',
      header: 'Nodes',
      elements: result.nodes.map((n) => ({
        key: n.id,
        element: (
          <div>
            {n.types.map((t) => (
              <NodeTypeComponent
                name={t}
                color={styleProvider.getStyle(n).color}
              />
            ))}
            &nbsp;
            {formatEntry(n)}
          </div>
        ),
        entity: { ...n, interfaceType: 'NodeDescriptor' as const },
      })),
    },
    {
      key: 'Edges',
      header: 'Edges',
      elements: result.edges.map((e) => ({
        key: e.id,
        element: (
          <div>
            <EdgeTypeComponent
              type={e.type}
              color={styleProvider.getStyle(e).color}
            />
            &nbsp;{formatEntry(e)}
          </div>
        ),
        entity: { ...e, interfaceType: 'EdgeDescriptor' as const },
      })),
    },
    {
      key: 'Node Types',
      header: 'Node Types',
      elements: result.nodeTypes.map((t) => ({
        key: t.name,
        element: (
          <NodeTypeComponent
            name={t.name}
            color={styleProvider.getStyle({ id: -1, types: [t.name] }).color}
          />
        ),
        entity: { ...t, interfaceType: 'NodeTypeDescriptor' as const },
      })),
    },
    {
      key: 'Edge Types',
      header: 'Edge Types',
      elements: result.edgeTypes.map((t) => ({
        key: t.name,
        element: (
          <EdgeTypeComponent
            type={t.name}
            color={
              styleProvider.getStyle({ id: -1, from: -1, to: -1, type: t.name })
                .color
            }
          />
        ),
        entity: { ...t, interfaceType: 'EdgeTypeDescriptor' as const },
      })),
    },
  ]
    .filter((e) => e.elements.length > 0)
    .map((x) => ({
      ...x,
      // Modify the key so that for new search string, new lists are returned
      key: searchString + x.key,
    }));
}
