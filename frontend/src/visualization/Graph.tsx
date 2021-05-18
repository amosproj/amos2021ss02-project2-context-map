import React, { useRef } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { AsyncProps, useAsync } from 'react-async';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, List, ListItemText } from '@material-ui/core';
import useService from '../dependency-injection/useService';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { QueryResult } from '../shared/queries/QueryResult';
import QueryService from '../services/QueryService';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../utils/CancellationToken';
import { useSize } from '../utils/useSize';
import EntityFilterElement from './components/EntityFilterElement';
import { NodeType } from '../shared/schema/NodeType';
import SchemaService from '../services/SchemaService';
import { EdgeType } from '../shared/schema/EdgeType';
import entityColors from './fixtures/GraphData';

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
    backdropCancel: {
      marginTop: theme.spacing(3),
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
    contentContainer: {
      padding: theme.spacing(3),
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
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
);

function convertNode(node: NodeDescriptor): vis.Node {
  return {
    id: node.id,
    label: node.id.toString(),
    // Advanced stuff, like styling nodes with different labels differently...
  };
}

function convertNodes(nodes: NodeDescriptor[]): vis.Node[] {
  return nodes.map((node) => convertNode(node));
}

function convertEdge(edge: EdgeDescriptor): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    // Advanced stuff, like styling edges with different labels differently...
  };
}

function convertEdges(edges: EdgeDescriptor[]): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge));
}

function convertQueryResult(queryResult: QueryResult): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes),
    edges: convertEdges(queryResult.edges),
  };
}

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
 * @returns The react-graph-vis options.
 */
function buildOptions(width: number, height: number) {
  return {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}

/**
 * A function that wraps the call to the query-service to be usable with react-async.
 * @param props The props that contains our paramter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the query result.
 */
function executeQuery(props: AsyncProps<QueryResult>): Promise<QueryResult> {
  const queryService = props.queryService as QueryService;
  const cancellation = props.cancellation as CancellationToken;
  return queryService.queryAll(
    { limit: { nodes: 200, edges: undefined } },
    cancellation
  );
}

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

function Graph(): JSX.Element {
  const classes = useStyles();

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  // The query- and schema-service injected from DI.
  const queryService = useService(QueryService, null);
  const schemaService = useService(SchemaService, null);

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

  // The state, as returned by react-async. Data is the query-result, when available.
  const {
    data: dataGraph,
    error: errorGraph,
    isLoading: isLoadingGraph,
  } = useAsync({
    promiseFn: executeQuery,
    queryService,
    cancellation: loadingCancellationSource.token,
  });

  // A function that must be here (unless you want React to explode) that cancels the query operation.
  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  // Display a waiting screen with a cancel options, while the query is in progress.
  if (isLoadingGraph || isLoadingNodes || isLoadingEdges) {
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
  if (errorGraph || errorNodes || errorEdges) {
    return (
      <div className={classes.contentContainer}>
        Something went wrong: {errorGraph?.message}
      </div>
    );
  }

  // Display an error message if something went wrong. This should not happen normally.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (!dataNodeTypes || !dataEdgeTypes || !dataGraph) {
    return <div className={classes.contentContainer}>Something went wrong</div>;
  }

  // Convert the query result to an object, react-graph-vis understands.
  const graphData = convertQueryResult(dataGraph);

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

  // Build the react-graph-vis graph options.
  const options = buildOptions(containerSize.width, containerSize.height);

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
    <>
      <div className={classes.graphPage}>
        <div className={classes.margin}>
          <List style={{ maxHeight: '100%', width: 300, overflow: 'auto' }}>
            <ListItemText primary="Node Types" />
            <div>{nodeTypes}</div>
            <ListItemText primary="Edge Types" />
            {edgeTypes}
          </List>
        </div>
        <div className={classes.graphContainer}>
          <div
            className={classes.sizeMeasureContainer}
            ref={sizeMeasureContainerRef}
          />
          <VisGraph graph={graphData} options={options} />
        </div>
      </div>
    </>
  );
}

export default Graph;
