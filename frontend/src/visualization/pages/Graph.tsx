import React, { useState } from 'react';
import VisGraph from 'react-graph-vis';
import { uuid } from 'uuidv4';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useService from '../../dependency-injection/useService';
import { ContainerSize } from '../../utils/useSize';
import useObservable from '../../utils/useObservable';
import QueryResultStore from '../../stores/QueryResultStore';
import convertQueryResult from '../shared-ops/convertQueryResult';
import { createSelectionInfo, EntityStyleStore } from '../../stores/colors';
import SearchSelectionStore from '../../stores/SearchSelectionStore';
import { isEntitySelected } from '../../stores/colors/EntityStyleProviderImpl';
import { buildOptions, useStylesVisualization } from './shared-options';

type GraphProps = {
  layout?: string;
  containerSize: ContainerSize;
};

function Graph(props: GraphProps): JSX.Element {
  const { layout, containerSize } = props;
  const classes = useStylesVisualization();

  // whether snackbar with hint that selected entity is not found is open or not
  const [noEntitiesFoundWarningOpen, setNoEntitiesFoundWarningOpen] =
    useState(false);
  const onNoEntitiesFoundWarningSnackbarClose = () => {
    setNoEntitiesFoundWarningOpen(false);
  };

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
