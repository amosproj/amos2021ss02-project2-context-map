import React from 'react';
import { Chip } from '@material-ui/core';
import { SearchResult } from '../shared/search/SearchResult';
import SearchResultList from './SearchResultList';

export default function convertSearchResultToSearchResultList(
  result: SearchResult | undefined
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
        element: <div>{n.id}</div>,
      })),
    },
    {
      key: 'Edges',
      header: 'Edges',
      elements: result.edges.map((n) => ({
        key: n.id,
        element: <div>{n.id}</div>,
      })),
    },
    {
      key: 'Node Types',
      header: 'Node Types',
      elements: result.nodeTypes.map((n) => ({
        key: n.name,
        element: <Chip label={n.name} />,
      })),
    },
    {
      key: 'Edge Types',
      header: 'Edge Types',
      elements: result.edgeTypes.map((n) => ({
        key: n.name,
        element: <Chip label={n.name} />,
      })),
    },
  ].filter((e) => e.elements.length > 0);
}
