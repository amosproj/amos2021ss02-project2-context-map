import React, { useState } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { tap } from 'rxjs/operators';
import useService from '../dependency-injection/useService';
import { ContainerSize } from '../utils/useSize';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';
import { QueryResult } from '../shared/queries';

const useStyles = makeStyles(() =>
  createStyles({
    graphContainer: {
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
  })
);

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
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
  containerSize: ContainerSize;
};

function Graph(props: GraphProps): JSX.Element {
  const { layout, containerSize } = props;
  const classes = useStyles();

  const graphDataStore = useService<QueryResultStore>(QueryResultStore);

  const [graphData, setGraphData] = useState<GraphData>({
    edges: [],
    nodes: [],
  });

  useObservable(
    graphDataStore.getState().pipe(
      tap((queryResult: QueryResult) => {
        // Convert the query result to an object, react-graph-vis understands.
        setGraphData(convertQueryResult(queryResult));
      })
    )
  );

  return (
    <>
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
    </>
  );
}

Graph.defaultProps = {
  layout: undefined,
};

export default Graph;
