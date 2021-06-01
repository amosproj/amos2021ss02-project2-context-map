import React, { useState } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { tap } from 'rxjs/operators';
import useService from '../dependency-injection/useService';
import { EdgeDescriptor } from '../shared/entities';
import { NodeResultDescriptor, QueryResult } from '../shared/queries';
import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';

const useStyles = makeStyles(() =>
  createStyles({
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    graphPage: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
    },
    graphContainer: {
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
    Filter: {
      // high zIndex so content is in the foreground
      zIndex: 1500,
    },
  })
);

function convertNode(node: NodeResultDescriptor): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    // Advanced stuff, like styling nodes with different types differently...
  };

  if (node.subsidiary) {
    result.color = 'yellow';
  }

  return result;
}

function convertNodes(nodes: NodeResultDescriptor[]): vis.Node[] {
  return nodes.map((node) => convertNode(node));
}

function convertEdge(edge: EdgeDescriptor): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    // Advanced stuff, like styling edges with different types differently...
  };
}

function convertEdges(edges: EdgeDescriptor[]): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge));
}

function convertQueryResult(queryResult: QueryResult): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes),
    edges: convertEdges(queryResult.edges),
  };
}

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
 * @returns The react-graph-vis options.
 */
function buildOptions(width: number, height: number) {
  return {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}

function Graph(): JSX.Element {
  const classes = useStyles();

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = React.useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  const graphDataStore = useService(QueryResultStore);

  const [graphData, setGraphData] = useState<GraphData>({
    edges: [],
    nodes: [],
  });

  useObservable(
    graphDataStore.getState().pipe(
      tap((queryResult) => {
        // Convert the query result to an object, react-graph-vis understands.
        setGraphData(convertQueryResult(queryResult));
      })
    )
  );

  return (
    <>
      <div
        // ref sizeMeasureContainerRef to classes.sizeMeasureContainer to compute containerSize.width and containerSize.height
        className={classes.sizeMeasureContainer}
        ref={sizeMeasureContainerRef}
      />
      <div className={classes.graphPage}>
        <div className={classes.graphContainer}>
          <VisGraph
            graph={graphData}
            options={buildOptions(containerSize.width, containerSize.height)}
            key={uuid()}
          />
        </div>
        <div className={classes.Filter}>
          <Filter />
        </div>
      </div>
    </>
  );
}

export default Graph;
