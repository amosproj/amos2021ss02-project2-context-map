import React from 'react';
import { combineLatest } from 'rxjs';
import ChordDiagram from 'react-chord-diagram';
import { map } from 'rxjs/operators';
import { Box, Container, Grid, Paper } from '@material-ui/core';
import useService from '../dependency-injection/useService';
import { SchemaService } from '../services/schema';
import { NodeTypeConnectionInfo } from '../shared/schema';
import useObservable from '../utils/useObservable';
import { EntityStyleProvider, EntityStyleStore } from '../stores/colors';

type ChordData = {
  matrix: number[][];
  names: string[];
  colors: string[];
};

/**
 * Generate a matrix with node connections, and a Record mapping node types to their index in the matrix and their color.
 * @param nodeTypeConnectionInfo data source to generate the matrix from.
 * @param styleProvider {@link EntityStyleProvider} instance.
 * @returns A tuple of [matrix, nodes], where
 * matrix is of size n*n, with each element matrix[i] being an array of n numbers,
 * and each matrix[i][j] represents and edge from the ith node in the graph
 * to the jth node,
 * nodes maps the node typenames to their indices in the matrix and their color.
 */
function convertToChordData(
  nodeTypeConnectionInfo: NodeTypeConnectionInfo[],
  styleProvider: EntityStyleProvider
): ChordData {
  const ret: ChordData = { matrix: [], names: [], colors: [] };
  // early exit on empty input
  if (nodeTypeConnectionInfo.length === 0) {
    return ret;
  }

  // map node names to their index in the matrix.
  const nodes: Record<string, number> = {};
  // fill names and colors array.
  let counter = 0;
  nodeTypeConnectionInfo.forEach((node) => {
    if (nodes[node.from] === undefined) {
      // save node index.
      nodes[node.from] = counter;
      counter += 1;
      // fill names and colors arrays.
      const fakeNode = { id: -1, types: [node.from] };
      ret.names.push(node.from);
      ret.colors.push(styleProvider.getStyle(fakeNode).color);
    }
  });

  // i*j matrix containing number of connection from node i to j.
  const matrix: number[][] = [];
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

  ret.matrix = matrix;

  return ret;
}

export default function ChordPage(): JSX.Element {
  const schemaService = useService(SchemaService);
  const entityStyleStore = useService(EntityStyleStore);

  const chordData = useObservable(
    combineLatest([
      schemaService.getNodeTypeConnectionInfo(),
      entityStyleStore.getState(),
    ]).pipe(map((next) => convertToChordData(next[0], next[1]))),
    { matrix: [], names: [], colors: [] }
  );

  return (
    <Box p={3}>
      <h1>Chord Diagram</h1>
      <Container maxWidth={false}>
        <Grid container spacing={0} justify="space-between">
          <Grid item lg={5} md={12}>
            <ChordDiagram
              matrix={chordData.matrix}
              componentId={1}
              groupLabels={chordData.names}
              groupColors={chordData.colors}
              outerRadius={260} // workaround for labels being cut off
            />
          </Grid>
          <Grid item lg={5} md={12}>
            <h2>Details</h2>
            Click a node type to display its details.
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
