import React, { useRef, useState } from 'react';
import VisGraph, { EventParameters, GraphEvents } from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useService from '../dependency-injection/useService';
import { ContainerSize } from '../utils/useSize';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';
import { createSelectionInfo, EntityStyleStore } from '../stores/colors';
import SearchSelectionStore from '../stores/SearchSelectionStore';
import { isEntitySelected } from '../stores/colors/EntityStyleProviderImpl';
import GraphDetails from './GraphDetails';
import { EntityDetailsStateStore } from '../stores/details/EntityDetailsStateStore';
import { EntityDetailsStore } from '../stores/details/EntityDetailsStore';
import { Node } from '../shared/entities';

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

  // whether snackbar with hint that selected entity is not found is open or not
  const [noEntitiesFoundWarningOpen, setNoEntitiesFoundWarningOpen] =
    useState(false);
  const onNoEntitiesFoundWarningSnackbarClose = () => {
    setNoEntitiesFoundWarningOpen(false);
  };

  const detailsStateStore = useService(EntityDetailsStateStore);
  const queryResultStore = useService(QueryResultStore);
  const entityColorStore = useService(EntityStyleStore);
  const searchSelectionStore = useService(SearchSelectionStore);

  const graphData = useObservable(
    // When one emits, the whole observable emits with the last emitted value from the other inputs
    // Example: New query result comes in => emits it with the most recent values from entityColorStore
    combineLatest([
      queryResultStore.getState(),
      entityColorStore.getState(),
    ]).pipe(map((next) => convertQueryResult(next[0], next[1]))),
    { edges: [], nodes: [] }
  );

  const detailsStore = useService(EntityDetailsStore);

  const details = useObservable(
    detailsStore.getState(),
    detailsStore.getValue()
  );

  const events: GraphEvents = {
    select: (params: EventParameters) => {
      const { nodes } = params;

      if (!Array.isArray(nodes) || nodes.length === 0) {
        detailsStateStore.clear();
        return;
      }

      let node = nodes[0];

      if (typeof node === 'string') {
        node = Number.parseFloat(node);
      }

      detailsStateStore.showNode(node);
    },
  };

  const graphRef = useRef<HTMLDivElement | null>(null);

  // When either the query result or the selected entity changes => check if
  // selection is in query result.
  useObservable(
    combineLatest([
      queryResultStore.getState(),
      searchSelectionStore.getState(),
    ]).pipe(
      tap(([queryResult, selection]) => {
        if (selection === undefined) return;
        const selectionInfo = createSelectionInfo(selection);
        const entityFound =
          queryResult.edges.some((e) => isEntitySelected(e, selectionInfo)) ||
          queryResult.nodes.some((n) => isEntitySelected(n, selectionInfo));
        if (!entityFound) {
          setNoEntitiesFoundWarningOpen(true);
        }
      })
    )
  );

  return (
    <>
      <GraphDetails />
      <div className={classes.graphContainer} ref={graphRef}>
        <VisGraph
          graph={graphData}
          options={buildOptions(
            containerSize.width,
            containerSize.height,
            layout
          )}
          events={events}
          key={uuid()}
          getNetwork={(network) => {
            network.unselectAll();
            if (details !== null) {
              if ((details as unknown as Node).types !== undefined) {
                if (graphData.nodes.some((node) => node.id === details.id)) {
                  network.selectNodes([details.id], true);
                }
              }
            }
          }}
        />
      </div>
      <Snackbar
        open={noEntitiesFoundWarningOpen}
        autoHideDuration={4000}
        onClose={onNoEntitiesFoundWarningSnackbarClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Alert severity="warning">
          Selected entity not found in the displayed graph.
        </Alert>
      </Snackbar>
    </>
  );
}

Graph.defaultProps = {
  layout: undefined,
};

export default Graph;
