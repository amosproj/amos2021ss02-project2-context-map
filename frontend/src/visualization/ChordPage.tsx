import React from 'react';
import { from } from 'rxjs';
import ChordDiagram from 'react-chord-diagram';
import { map } from 'rxjs/operators';
import useService from '../dependency-injection/useService';
import { SchemaService } from '../services/schema';
import { NodeTypeConnectionInfo } from '../shared/schema';
import ErrorStore from '../stores/ErrorStore';
import LoadingStore from '../stores/LoadingStore';
import useObservable from '../utils/useObservable';
import withErrorHandler from '../utils/withErrorHandler';
import withLoadingBar from '../utils/withLoadingBar';
import { EntityStyleStore } from '../stores/colors';

/**
 * Generate a matrix with node connections, and an array with node names in the matrix.
 * @param nodeTypeConnectionInfo data source to generate the matrix from.
 * @returns A tuple of [matrix, nodes], where
 * matrix is of size n*n, with each element matrix[i] being an array of n numbers,
 * and each matrix[i][j] represents the flow from the ith node in the network
 * to the jth node, and
 * nodes[i] contains the name of the node in matrix[i]
 */
function generateNodesAndMatrix(
  nodeTypeConnectionInfo: NodeTypeConnectionInfo[]
): [number[][], Record<string, number>] {
  // empty input
  if (nodeTypeConnectionInfo.length === 0) {
    return [[], {}];
  }

  const matrix: number[][] = [];
  // maps node names to their index in the matrix.
  const nodes: Record<string, number> = {};

  let counter = 0;
  nodeTypeConnectionInfo.forEach((node) => {
    if (nodes[node.from] === undefined) {
      nodes[node.from] = counter;
      counter += 1;
    }
  });

  // initialize empty n*n matrix where n is number of nodes.
  for (let i = 0; i < counter; i += 1) {
    matrix.push(new Array(counter).fill(0));
  }

  // generate matrix
  for (const node of nodeTypeConnectionInfo) {
    const i = nodes[node.from];
    const j = nodes[node.to];
    matrix[i][j] += node.numConnections;
  }

  return [matrix, nodes];
}

export default function ChordPage(): JSX.Element {
  const schemaService = useService(SchemaService, null);
  const entityColorStore = useService(EntityStyleStore);

  const loadingStore = useService(LoadingStore);
  const errorStore = useService(ErrorStore);

  const matrix = useObservable(
    from(schemaService.getNodeTypeConnectionInfo()).pipe(
      withLoadingBar({ loadingStore }),
      withErrorHandler({ errorStore }),
      map((nodeTypeConnectionInfo) =>
        generateNodesAndMatrix(nodeTypeConnectionInfo)
      )
    ),
    [[], {}]
  );

  return (
    <ChordDiagram
      matrix={matrix[0]}
      componentId={1}
      groupLabels={Object.keys(matrix[1])}
      groupColors={['#000000', '#FFDD89', '#957244', '#F26223']}
    />
  );
}
