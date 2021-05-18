import { AsyncProps, useAsync } from 'react-async';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { Box, List, ListItemText } from '@material-ui/core';
import React, { useRef } from 'react';
import entityColors from '../fixtures/GraphData';

import useService from '../../dependency-injection/useService';
import SchemaService from '../../services/SchemaService';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../../utils/CancellationToken';
import { NodeType } from '../../shared/schema/NodeType';
import { EdgeType } from '../../shared/schema/EdgeType';

import EntityFilterElement from './components/EntityFilterElement';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    backdropContent: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    backdropCancel: {
      marginTop: theme.spacing(3),
    },
    contentContainer: {
      padding: theme.spacing(3),
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
);

function fetchNodeTypes(props: AsyncProps<NodeType[]>): Promise<NodeType[]> {
  const schemaService = props.schemaService as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getNodeTypes(cancellation);
}

function fetchEdgeTypes(props: AsyncProps<EdgeType[]>): Promise<NodeType[]> {
  const schemaService = props.schemaService as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getEdgeTypes(cancellation);
}

const Filter = (): JSX.Element => {
  const classes = useStyles();
  const schemaService = useService(SchemaService, null);

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = useRef<HTMLDivElement>(null);

  // The component state that contains the cancellation token source used to cancel the query operation.
  const [loadingCancellationSource] = React.useState(
    new CancellationTokenSource()
  );

  // The state, as returned by react-async. Data are the node-types, when available.
  const {
    data: dataNodeTypes,
    error: errorNodes,
    isLoading: isLoadingNodes,
  } = useAsync({
    promiseFn: fetchNodeTypes,
    schemaService,
    cancellation: loadingCancellationSource.token,
  });

  // The state, as returned by react-async. Data are the edge-types, when available.
  const {
    data: dataEdgeTypes,
    error: errorEdges,
    isLoading: isLoadingEdges,
  } = useAsync({
    promiseFn: fetchEdgeTypes,
    schemaService,
    cancellation: loadingCancellationSource.token,
  });

  // A function that must be here (unless you want React to explode) that cancels the query operation.
  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  // Display a waiting screen with a cancel options, while the query is in progress.
  if (isLoadingNodes || isLoadingEdges) {
    return (
      <>
        <div
          className={classes.sizeMeasureContainer}
          ref={sizeMeasureContainerRef}
        />
        <Backdrop className={classes.backdrop} open>
          <div className={classes.backdropContent}>
            <CircularProgress color="inherit" />
            <Button
              variant="outlined"
              color="default"
              onClick={cancelLoading}
              className={classes.backdropCancel}
            >
              <CloseIcon />
              Cancel
            </Button>
          </div>
        </Backdrop>
      </>
    );
  }

  // Display the raw error message if an error occurred.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (errorNodes || errorEdges) {
    const error: Error | undefined =
      errorNodes === null ? errorNodes : errorEdges;
    return (
      <div className={classes.contentContainer}>
        Something went wrong: {error?.message}
      </div>
    );
  }

  // Display an error message if something went wrong. This should not happen normally.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (!dataNodeTypes || !dataEdgeTypes) {
    return <div className={classes.contentContainer}>Something went wrong</div>;
  }

  const nodeColorsAndTypes: {
    color: string;
    type: string;
    entityTypePropertyNames: string[];
  }[] = [];

  for (let i = 0; i < dataNodeTypes.length; i += 1) {
    nodeColorsAndTypes.push({
      color: entityColors[i % entityColors.length],
      type: dataNodeTypes[i].name,
      entityTypePropertyNames: dataNodeTypes[i].properties.map(
        (property) => property.name
      ),
    });
  }

  const edgeColorsAndTypes: {
    color: string;
    type: string;
    entityTypePropertyNames: string[];
  }[] = [];

  for (let i = 0; i < dataEdgeTypes.length; i += 1) {
    edgeColorsAndTypes.push({
      color: '#a9a9a9',
      type: dataEdgeTypes[i].name,
      entityTypePropertyNames: dataEdgeTypes[i].properties.map(
        (property) => property.name
      ),
    });
  }

  const entityTemplate = (
    color: string,
    type: string,
    entityTypePropertyNames: string[]
  ) => (
    <div>
      <Box display="flex" p={1}>
        <EntityFilterElement
          backgroundColor={color}
          name={type}
          entityTypePropertyNames={entityTypePropertyNames}
        />
      </Box>
    </div>
  );

  const nodeTypes: unknown[] = [];
  const edgeTypes: unknown[] = [];

  // store entityType-elements.
  nodeColorsAndTypes.forEach((colorsAndTypes) => {
    nodeTypes.push(
      entityTemplate(
        colorsAndTypes.color,
        colorsAndTypes.type,
        colorsAndTypes.entityTypePropertyNames
      )
    );
  });

  edgeColorsAndTypes.forEach((colorsAndTypes) => {
    edgeTypes.push(
      entityTemplate(
        colorsAndTypes.color,
        colorsAndTypes.type,
        colorsAndTypes.entityTypePropertyNames
      )
    );
  });

  return (
    <div className={classes.margin}>
      <List style={{ maxHeight: '100%', width: 300, overflow: 'auto' }}>
        <ListItemText primary="Node Types" />
        <div>{nodeTypes}</div>
        <ListItemText primary="Edge Types" />
        {edgeTypes}
      </List>
    </div>
  );
};

export default Filter;
