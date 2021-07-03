import React, { useRef, useState } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
  Box,
  List,
  ListItem,
  Paper,
  Popper,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useService from '../dependency-injection/useService';
import { ContainerSize } from '../utils/useSize';
import useObservable from '../utils/useObservable';
import QueryResultStore from '../stores/QueryResultStore';
import convertQueryResult from './shared-ops/convertQueryResult';
import { createSelectionInfo, EntityStyleStore } from '../stores/colors';
import SearchSelectionStore from '../stores/SearchSelectionStore';
import { isEntitySelected } from '../stores/colors/EntityStyleProviderImpl';

const useStyles = makeStyles(() =>
  createStyles({
    graphContainer: {
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
    popper: {
      zIndex: 1201,
      marginLeft: '60px',
      marginTop: '115px',
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
  const [detailsPopperOpen, setDetailsPopperOpen] = useState(false);

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

  const events = {
    select: ({ nodes, edges }: GraphData) => {
      if (nodes.length === 0 && edges.length === 0) {
        setDetailsPopperOpen(false);
        return;
      }
      const nodeId = nodes[0];
      console.log(nodeId);
      setDetailsPopperOpen(true);
      console.log(detailsPopperOpen);
    },
  };

  const graphRef = useRef(null);

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
      <Popper
        className={classes.popper}
        open={detailsPopperOpen}
        anchorEl={graphRef.current}
      >
        <Paper>
          <Box m={1}>
            <Typography variant="h6">Node details</Typography>
            <List>
              <ListItem>Type: X</ListItem>
              <ListItem>Category: Y</ListItem>
              <ListItem>And: More</ListItem>
              <ListItem>Details: edges?</ListItem>
            </List>
          </Box>
        </Paper>
      </Popper>
      <div className={classes.graphContainer}>
        <VisGraph
          ref={graphRef}
          graph={graphData}
          options={buildOptions(
            containerSize.width,
            containerSize.height,
            layout
          )}
          events={events}
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
