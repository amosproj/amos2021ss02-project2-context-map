import React from 'react';
import SearchResultList from './SearchResultList';
import {
  SearchEdgeResult,
  SearchNodeResult,
  SearchResult,
} from '../shared/search';
import NodeTypeComponent from './helper/NodeTypeComponent';
import EdgeTypeComponent from './helper/EdgeTypeComponent';

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
  result: SearchResult | undefined
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
              <NodeTypeComponent name={t} />
            ))}
            &nbsp;
            {formatEntry(n)}
          </div>
        ),
        href: `/data/node/${n.id}`,
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
            &nbsp;{formatEntry(n)}
          </div>
        ),
        href: `/data/edge/${n.id}`,
      })),
    },
    {
      key: 'Node Types',
      header: 'Node Types',
      elements: result.nodeTypes.map((n) => ({
        key: n.name,
        element: <NodeTypeComponent name={n.name} />,
        href: `/data/node-type/${n.name}`,
      })),
    },
    {
      key: 'Edge Types',
      header: 'Edge Types',
      elements: result.edgeTypes.map((n) => ({
        key: n.name,
        element: <EdgeTypeComponent type={n.name} />,
        href: `/data/edge-type/${n.name}`,
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
