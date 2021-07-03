import React from 'react';
import VisGraph from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { useSnackbar } from 'notistack';
import useService from '../dependency-injection/useService';
import { ContainerSize } from '../utils/useSize';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';
import { createSelectionInfo, EntityStyleStore } from '../stores/colors';
import SearchSelectionStore from '../stores/SearchSelectionStore';
import { isEntitySelected } from '../stores/colors/EntityStyleProviderImpl';

const SNACKBAR_KEYS = {
  SHORTEST_PATH_NOT_FOUND: 'shortest-path-not-found',
  SEARCH_NOT_FOUND: 'search-not-found',
};

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
  containerSize: ContainerSize;
};

function Graph(props: GraphProps): JSX.Element {
  const { layout, containerSize } = props;
  const classes = useStyles();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const queryResultStore = useService(QueryResultStore);
  const entityColorStore = useService(EntityStyleStore);
  const searchSelectionStore = useService(SearchSelectionStore);

  const graphData = useObservable(
    // When one emits, the whole observable emits with the last emitted value from the other inputs
    // Example: New query result comes in => emits it with the most recent values from entityColorStore
    combineLatest([
      queryResultStore.getState(),
      entityColorStore.getState(),
    ]).pipe(
      tap(([queryResult]) => {
        closeSnackbar(SNACKBAR_KEYS.SHORTEST_PATH_NOT_FOUND);
        if (queryResult.containsShortestPath === false) {
          SNACKBAR_KEYS.SHORTEST_PATH_NOT_FOUND = uuid();
          enqueueSnackbar(
            'No shortest path found, please adjust filter settings or ignore edge directions',
            {
              variant: 'warning',
              key: SNACKBAR_KEYS.SHORTEST_PATH_NOT_FOUND,
            }
          );
        }
      }),
      map(([queryResult, styleProvider]) =>
        convertQueryResult(queryResult, styleProvider)
      )
    ),
    { edges: [], nodes: [] }
  );

  // When either the query result or the selected entity changes => check if
  // selection is in query result.
  useObservable(
    combineLatest([
      queryResultStore.getState(),
      searchSelectionStore.getState(),
    ]).pipe(
      tap(([queryResult, selection]) => {
        closeSnackbar(SNACKBAR_KEYS.SEARCH_NOT_FOUND);
        if (selection === undefined) return;
        const selectionInfo = createSelectionInfo(selection);
        const entityFound =
          queryResult.edges.some((e) => isEntitySelected(e, selectionInfo)) ||
          queryResult.nodes.some((n) => isEntitySelected(n, selectionInfo));
        if (!entityFound) {
          SNACKBAR_KEYS.SEARCH_NOT_FOUND = uuid();
          enqueueSnackbar('Selected entity not found in the displayed graph', {
            variant: 'warning',
            key: SNACKBAR_KEYS.SEARCH_NOT_FOUND,
          });
        }
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
