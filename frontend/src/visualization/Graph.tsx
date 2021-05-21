import React, { useRef } from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { AsyncProps } from 'react-async';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useService from '../dependency-injection/useService';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import { NodeDescriptor } from '../shared/entities/NodeDescriptor';
import { QueryResult } from '../shared/queries';
import QueryService from '../services/QueryService';
import { CancellationToken } from '../utils/CancellationToken';
import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';
import fetchDataFromService from './shared-ops/FetchData';

const useStyles = makeStyles(() =>
  createStyles({
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
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
  })
);

function convertNode(node: NodeDescriptor): vis.Node {
  return {
    id: node.id,
    label: node.id.toString(),
    // Advanced stuff, like styling nodes with different types differently...
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
    // Advanced stuff, like styling edges with different types differently...
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
  const queryService = props.service as QueryService;
  const cancellation = props.cancellation as CancellationToken;
  return queryService.queryAll(
    { limits: { nodes: 200, edges: undefined } },
    cancellation
  );
}

function Graph(): JSX.Element {
  const classes = useStyles();

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  // The query- and schema-service injected from DI.
  const queryService = useService(QueryService, null);

  const data = fetchDataFromService(executeQuery, queryService);

  // check if data is an JSX.Element -> is still loading or error.
  if (React.isValidElement(data)) {
    return (
      <>
        <div
          // ref sizeMeasureContainerRef to classes.sizeMeasureContainer to compute containerSize.width and containerSize.height
          className={classes.sizeMeasureContainer}
          ref={sizeMeasureContainerRef}
        />
        {data}
      </>
    );
  }
  // Convert the query result to an object, react-graph-vis understands.
  const graphData = convertQueryResult(data as QueryResult);

  // Build the react-graph-vis graph options.
  const options = buildOptions(containerSize.width, containerSize.height);

  return (
    <>
      <div className={classes.graphPage}>
        <div className={classes.graphContainer}>
          <div
            className={classes.sizeMeasureContainer}
            ref={sizeMeasureContainerRef}
          />
          <VisGraph graph={graphData} options={options} />
        </div>
        <Filter />
      </div>
    </>
  );
}

export default Graph;
