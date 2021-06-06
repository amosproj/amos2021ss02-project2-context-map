import React from 'react';
import VisGraph from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import useService from '../dependency-injection/useService';
import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';
import NodeColorStore from '../stores/colors/NodeColorStore';
import EdgeColorStore from '../stores/colors/EdgeColorStore';

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
 * @param layout Possible values: "hierarchical", undefined
 * @returns The react-graph-vis options.
 */
function buildOptions(width: number, height: number, layout?: string) {
  return {
    layout: {
      hierarchical: layout === 'hierarchical',
    },
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}

type GraphProps = {
  layout?: string;
};

function Graph(props: GraphProps): JSX.Element {
  const { layout } = props;
  const classes = useStyles();

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = React.useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  const queryResultStore = useService(QueryResultStore);
  const nodeColorStore = useService(NodeColorStore);
  const edgeColorStore = useService(EdgeColorStore);

  const graphData = useObservable(
    // When one emits, the whole observable emits with the last emitted value from the other inputs
    // Example: New query result comes in => emits it with the most recent values from nodeColorStore & edgeColorStore
    combineLatest([
      queryResultStore.getState(),
      nodeColorStore.getState(),
      edgeColorStore.getState(),
    ]).pipe(map((next) => convertQueryResult(next[0], next[1], next[2]))),
    { edges: [], nodes: [] }
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
            options={buildOptions(
              containerSize.width,
              containerSize.height,
              layout
            )}
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

Graph.defaultProps = {
  layout: undefined,
};

export default Graph;
