import React, { useState } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { tap } from 'rxjs/operators';
import useService from '../dependency-injection/useService';
import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';

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

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
 * @returns The react-graph-vis options.
 */
function buildOptions(width: number, height: number) {
  return {
    layout: {
      hierarchical: true,
    },
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}

function Hierarchies(): JSX.Element {
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

export default Hierarchies;
