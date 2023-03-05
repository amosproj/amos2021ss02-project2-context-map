/* istanbul ignore file */
import React, { useEffect } from 'react';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import VisGraph from 'react-graph-vis';
import { uuid } from 'uuidv4';
import { useSnackbar } from 'notistack';
import useService from '../../dependency-injection/useService';
import useObservable from '../../utils/useObservable';
import { ContainerSize } from '../../utils/useSize';
import useStylesVisualization from './useStylesVisualization';
import visGraphBuildOptions from './visGraphBuildOptions';
import EntityStyleStore, {
  createSelectionInfo,
} from '../../stores/colors/EntityStyleStore';
import { isEntitySelected } from '../../stores/colors/EntityStyleProviderImpl';
import SearchSelectionStore from '../../stores/SearchSelectionStore';
import { SchemaService } from '../../services/schema';
import styleSchemaQueryResult from '../shared-ops/styleSchemaQueryResult';

/**
 * Keys for the snackbar notifications.
 * These keys are not readonly.
 */
const SNACKBAR_KEYS = {
  SEARCH_NOT_FOUND: 'search-not-found',
};

function Schema(props: { containerSize: ContainerSize }): JSX.Element {
  const { containerSize } = props;
  const classes = useStylesVisualization();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const schemaService = useService(SchemaService);
  const entityStyleStore = useService(EntityStyleStore);
  const searchSelectionStore = useService(SearchSelectionStore);

  // Data used to visualize the schema.
  const graphData = useObservable(
    combineLatest([
      schemaService.getMetaGraph(),
      entityStyleStore.getState(),
    ]).pipe(
      map(([queryResult, styleProvider]) =>
        styleSchemaQueryResult(queryResult, styleProvider)
      )
    ),
    { edges: [], nodes: [] }
  );

  // When either the schema or the selected entity changes => check if
  // selection is in schema.
  useObservable(
    combineLatest([
      schemaService.getMetaGraph(),
      searchSelectionStore.getState(),
    ]).pipe(
      tap(([queryResult, selection]) => {
        closeSnackbar(SNACKBAR_KEYS.SEARCH_NOT_FOUND);
        if (selection === undefined) return;
        const selectionInfo = createSelectionInfo(selection);
        const entityTypeFound =
          queryResult.edges.some((e) => isEntitySelected(e, selectionInfo)) ||
          queryResult.nodes.some((n) => isEntitySelected(n, selectionInfo));
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
