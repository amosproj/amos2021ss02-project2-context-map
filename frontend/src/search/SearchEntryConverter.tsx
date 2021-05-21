import React from 'react';
import SearchResultList from './SearchResultList';
import { ExpandedSearchResult } from '../shared/search/ExpandedSearchResult';
import NodeTypeComponent from './helper/NodeTypeComponent';
import EdgeTypeComponent from './helper/EdgeTypeComponent';

export default function convertSearchResultToSearchResultList(
  result: ExpandedSearchResult | undefined
): SearchResultList[] {
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
              <NodeTypeComponent name={t} />
            ))}
            &nbsp;
            {n.id}
          </div>
        ),
      })),
    },
    {
      key: 'Edges',
      header: 'Edges',
      elements: result.edges.map((n) => ({
        key: n.id,
        element: (
          <div>
            <EdgeTypeComponent type={n.type} />
            &nbsp;{n.id}
          </div>
        ),
      })),
    },
    {
      key: 'Node Types',
      header: 'Node Types',
      elements: result.nodeTypes.map((n) => ({
        key: n.name,
        element: <NodeTypeComponent name={n.name} />,
      })),
    },
    {
      key: 'Edge Types',
      header: 'Edge Types',
      elements: result.edgeTypes.map((n) => ({
        key: n.name,
        element: <EdgeTypeComponent type={n.name} />,
      })),
    },
  ].filter((e) => e.elements.length > 0);
}
