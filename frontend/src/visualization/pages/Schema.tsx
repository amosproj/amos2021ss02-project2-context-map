import React, { useEffect } from 'react';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import VisGraph from 'react-graph-vis';
import { uuid } from 'uuidv4';
import { useSnackbar } from 'notistack';
import useService from '../../dependency-injection/useService';
import SchemaStore from '../../stores/SchemaStore';
import useObservable from '../../utils/useObservable';
import convertSchema from '../shared-ops/convertSchema';
import { ContainerSize } from '../../utils/useSize';
import useStylesVisualization from './useStylesVisualization';
import visGraphBuildOptions from './visGraphBuildOptions';
import EntityStyleStore, {
  createSelectionInfo,
} from '../../stores/colors/EntityStyleStore';
import { isEntitySelected } from '../../stores/colors/EntityStyleProviderImpl';
import SearchSelectionStore from '../../stores/SearchSelectionStore';
import createDummyEdgeFromType from '../shared-ops/createDummyEdgeFromType';
import createDummyNodeFromType from '../shared-ops/createDummyNodeFromType';

/**
 * Keys for the snackbar notifications.
 * These keys are not readonly.
 */
const SNACKBAR_KEYS = {
  SHORTEST_PATH_NOT_FOUND: 'shortest-path-not-found',
  SEARCH_NOT_FOUND: 'search-not-found',
};

function Schema(props: { containerSize: ContainerSize }): JSX.Element {
  const { containerSize } = props;
  const classes = useStylesVisualization();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const schemaStore = useService(SchemaStore);
  const entityStyleStore = useService(EntityStyleStore);
  const searchSelectionStore = useService(SearchSelectionStore);

  // Data used to visualize the schema.
  const graphData = useObservable(
    combineLatest([schemaStore.getState(), entityStyleStore.getState()]).pipe(
      map((next) => convertSchema(next[0], next[1]))
    ),
    { edges: [], nodes: [] }
  );

  // When either the schema or the selected entity changes => check if
  // selection is in schema.
  useObservable(
    combineLatest([
      schemaStore.getState(),
      searchSelectionStore.getState(),
    ]).pipe(
      tap(([schema, selection]) => {
        closeSnackbar(SNACKBAR_KEYS.SEARCH_NOT_FOUND);
        if (selection === undefined) return;
        const selectionInfo = createSelectionInfo(selection);
        const entityTypeFound =
          schema.edgeTypes.some((e) =>
            isEntitySelected(createDummyEdgeFromType(e), selectionInfo)
          ) ||
          schema.nodeTypes.some((n) =>
            isEntitySelected(createDummyNodeFromType(n), selectionInfo)
          );
        if (!entityTypeFound) {
          // assign new random id to avoid strange ui glitches
          SNACKBAR_KEYS.SEARCH_NOT_FOUND = uuid();
          enqueueSnackbar('Selection is not an entity type.', {
            variant: 'warning',
            key: SNACKBAR_KEYS.SEARCH_NOT_FOUND,
          });
        }
      })
    )
  );

  // on unmount: clear search
  useEffect(() => () => searchSelectionStore.setState(undefined), []);

  return (
    <div className={classes.graphContainer}>
      <VisGraph
        graph={graphData}
        options={visGraphBuildOptions(
          containerSize.width,
          containerSize.height
        )}
        key={uuid()}
      />
    </div>
  );
}

export default Schema;
