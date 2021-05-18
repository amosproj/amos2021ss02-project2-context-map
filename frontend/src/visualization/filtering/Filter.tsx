import { AsyncProps, useAsync } from 'react-async';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { AppBar, Box, List, Tab, Tabs, Typography } from '@material-ui/core';
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
  })
);
interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
/**
 * A function that wraps the call to the schema-service to be usable with react-async.
 * @param props The props that contains our paramter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the nodeTypes.
 */
function fetchNodeTypes(props: AsyncProps<NodeType[]>): Promise<NodeType[]> {
  const schemaService = props.schemaService as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getNodeTypes(cancellation);
}

/**
 * A function that wraps the call to the schema-service to be usable with react-async.
 * @param props The props that contains our paramter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the edgeTypes.
 */
function fetchEdgeTypes(props: AsyncProps<EdgeType[]>): Promise<NodeType[]> {
  const schemaService = props.schemaService as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getEdgeTypes(cancellation);
}

const Filter = (): JSX.Element => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
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
    name: string;
    entityTypePropertyNames: string[];
  }[] = [];

  for (let i = 0; i < dataNodeTypes.length; i += 1) {
    nodeColorsAndTypes.push({
      color: entityColors[i % entityColors.length],
      name: dataNodeTypes[i].name,
      entityTypePropertyNames: dataNodeTypes[i].properties.map(
        (property) => property.name
      ),
    });
  }

  const edgeColorsAndTypes: {
    color: string;
    name: string;
    entityTypePropertyNames: string[];
  }[] = [];

  for (let i = 0; i < dataEdgeTypes.length; i += 1) {
    edgeColorsAndTypes.push({
      color: '#a9a9a9',
      name: dataEdgeTypes[i].name,
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
        colorsAndTypes.name,
        colorsAndTypes.entityTypePropertyNames
      )
    );
  });

  edgeColorsAndTypes.forEach((colorsAndTypes) => {
    edgeTypes.push(
      entityTemplate(
        colorsAndTypes.color,
        colorsAndTypes.name,
        colorsAndTypes.entityTypePropertyNames
      )
    );
  });

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Node Types" />
          <Tab label="Edge Types" />
        </Tabs>
      </AppBar>
      <List style={{ maxHeight: '94%', width: 320, overflow: 'auto' }}>
        <TabPanel value={value} index={0}>
          <div>{nodeTypes}</div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {edgeTypes}
        </TabPanel>
      </List>
    </div>
  );
};

export default Filter;
