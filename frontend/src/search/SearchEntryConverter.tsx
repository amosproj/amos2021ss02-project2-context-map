import React from 'react';
import SearchResultList from './SearchResultList';
import { ExpandedSearchResult } from '../shared/search/ExpandedSearchResult';
import NodeTypeComponent from './helper/NodeTypeComponent';
import EdgeTypeComponent from './helper/EdgeTypeComponent';
import { Node } from '../shared/entities/Node';
import { Edge } from '../shared/entities/Edge';
import { Property } from '../shared/entities/Property';

/**
 * This is an first approach to find the attribute that contains `searchString`.
 */
function findSearchStringInProperties(
  searchString: string,
  entity: Node | Edge
) {
  const search = searchString.toLocaleLowerCase();
  let foundValue: string | undefined;
  const idString = `[${entity.id}]`;

  const format = (propName: string, propValue: string) =>
    `{ ${propName}: ${propValue} }`;

  /**
   * Returns `value.toString()` if `search` was found in `value`
   */
  function findInPrimitive(value: string | number | unknown) {
    if (
      (typeof value === 'string' &&
        value.toLocaleLowerCase().search(search) >= 0) || // strings
      (typeof value === 'number' && value.toString().search(search) >= 0) // numbers
    ) {
      return value.toString();
    }
    return undefined;
  }

  /**
   * Returns a formatted string ({@link format}) if `search` was found
   * somewhere in the (nested) object `props`
   */
  function findInProperties(props: {
    [key: string]: Property;
  }): string | undefined {
    for (const propName of Object.keys(props)) {
      const propValue = props[propName];

      foundValue = findInPrimitive(propValue);
      if (foundValue) {
        // String or Number value found
        return format(propName, foundValue);
      }

      if (Array.isArray(propValue)) {
        const foundValues = propValue
          .map((x) => findInPrimitive(x)) // Returns string if found
          .filter((x) => x !== undefined); // Returns only "found" items

        if (foundValues?.length > 0) {
          const allValuesMatch = foundValues.length === propValue.length;
          return format(
            propName,
            `[${foundValues.join(', ')}${allValuesMatch ? ', ...' : ''}]`
          );
        }
      }

      if (typeof propValue === 'object' && propValue != null) {
        foundValue = findInProperties(propValue as Record<string, unknown>);
        if (foundValue) {
          return format(propName, foundValue);
        }
      }
    }
    return undefined;
  }

  foundValue = findInProperties(entity.properties);
  return `${idString} ${foundValue ?? ''}`;
}

export default function convertSearchResultToSearchResultList(
  searchString: string,
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
            {findSearchStringInProperties(searchString, n)}
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
            &nbsp;{findSearchStringInProperties(searchString, n)}
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
  ]
    .filter((e) => e.elements.length > 0)
    .map((x) => ({
      ...x,
      // Modify the key so that for new search string, new lists are returned
      key: searchString + x.key,
    }));
}
