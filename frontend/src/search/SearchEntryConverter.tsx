import React from 'react';
import SearchResultList from './SearchResultList';
import {
  SearchEdgeResult,
  SearchNodeResult,
  SearchResult,
} from '../shared/search';
import NodeTypeComponent from './helper/NodeTypeComponent';
import EdgeTypeComponent from './helper/EdgeTypeComponent';
import { EntityColorizer } from '../stores/colors';

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
  colorizer: EntityColorizer
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
              <NodeTypeComponent name={t} color={colorizer.colorize(n).color} />
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
      elements: result.edges.map((e) => ({
        key: e.id,
        element: (
          <div>
            <EdgeTypeComponent
              type={e.type}
              color={colorizer.colorize(e).color}
            />
            &nbsp;{formatEntry(e)}
          </div>
        ),
        href: `/data/edge/${e.id}`,
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
            color={colorizer.colorize({ id: -1, types: [t.name] }).color}
          />
        ),
        href: `/data/node-type/${t.name}`,
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
              colorizer.colorize({ id: -1, from: -1, to: -1, type: t.name })
                .color
            }
          />
        ),
        href: `/data/edge-type/${t.name}`,
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
