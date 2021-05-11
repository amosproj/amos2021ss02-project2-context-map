import React, { useRef } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { AsyncProps, useAsync } from 'react-async';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useService from '../dependency-injection/useService';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { QueryResult } from '../shared/queries/QueryResult';
import QueryService from '../services/QueryService';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../utils/CancellationToken';
import { useContainerSize } from '../utils/useContainerSize';
import { deduplicateEntities } from '../utils/deduplicateEntities';
import filterQueryResult from '../utils/filterQueryResult';

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
  const dedupNodes = deduplicateEntities(nodes, false);
  return dedupNodes.map((node) => convertNode(node));
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
  const dedupEdges = deduplicateEntities(edges, false);
  return dedupEdges.map((edge) => convertEdge(edge));
}

function convertQueryResult(queryResult: QueryResult): GraphData {
  const filteredQueryResult = filterQueryResult(queryResult);

  return {
    nodes: convertNodes(filteredQueryResult.nodes),
    edges: convertEdges(filteredQueryResult.edges),
  };
}

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

function executeQuery(props: AsyncProps<QueryResult>): Promise<QueryResult> {
  const queryService = props.queryService as QueryService;
  const cancellation = props.cancellation as CancellationToken;
  return queryService.queryAll(
    { limit: { nodes: 200, edges: undefined } },
    cancellation
  );
}

function Graph(): JSX.Element {
  const classes = useStyles();
  const sizeMeasureContainerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(sizeMeasureContainerRef);
  const queryService = useService(QueryService, null);
  // The component state that contains the cancellation token source used to cancel the load operation.
  const [loadingCancellationSource] = React.useState(
    new CancellationTokenSource()
  );
  const { data, error, isLoading } = useAsync({
    promiseFn: executeQuery,
    queryService,
    cancellation: loadingCancellationSource.token,
  });

  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className={classes.contentContainer}>
        Something went wrong: {error.message}
      </div>
    );
  }

  if (!data) {
    return <div className={classes.contentContainer}>Something went wrong</div>;
  }

  const graphData = convertQueryResult(data);
  const options = buildOptions(containerSize.width, containerSize.height);

  return (
    <>
      <div
        className={classes.sizeMeasureContainer}
        ref={sizeMeasureContainerRef}
      />
      <VisGraph graph={graphData} options={options} />
    </>
  );
}

export default Graph;
