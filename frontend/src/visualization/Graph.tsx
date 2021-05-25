import React from 'react';
import VisGraph, { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import useService from '../dependency-injection/useService';
import { EdgeDescriptor } from '../shared/entities/EdgeDescriptor';
import {
  FilterQuery,
  NodeResultDescriptor,
  QueryResult,
} from '../shared/queries';
import { CancellationToken } from '../utils/CancellationToken';
import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';
import fetchDataFromService from './shared-ops/fetchDataFromService';
import { FilterService } from '../services/filter';

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
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
    filter: {
      // high zIndex so content is in the foreground
      zIndex: 1500,
    },
  })
);

function convertNode(node: NodeResultDescriptor): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    // Advanced stuff, like styling nodes with different types differently...
  };

  if (node.subsidiary) {
    result.color = 'yellow';
  }

  return result;
}

function convertNodes(nodes: NodeResultDescriptor[]): vis.Node[] {
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
 * Fetches a filtered QueryResult from the filterService.
 *
 * @param filterService - the filterService the data is fetched from
 * @param filterQuery - the filterQuery that is applied for filtering
 * @param cancellation - the cancellation token
 */
function executeFilterQuery(
  filterService: FilterService,
  filterQuery: React.MutableRefObject<FilterQuery>,
  cancellation: CancellationToken
): Promise<QueryResult> {
  return filterService.query(filterQuery.current, cancellation);
}

function Graph(): JSX.Element {
  const classes = useStyles();

  // the filtered QueryResult from child-component EntityFilterDialog
  const filterQueryRef = React.useRef<FilterQuery>({});

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = React.useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  // The query- and schema-service injected from DI.
  const filterService = useService(FilterService, null);

  // Dirty hack to get to to instance of the update function for components that are not part of
  // the the render content function. This is a workaround for
  // https://github.com/amosproj/amos-ss2021-project2-context-map/issues/187 and for
  // https://github.com/amosproj/amos-ss2021-project2-context-map/issues/186
  // that causes the filter to be use-less, as the filter conditions are reset on every load.
  // This workaround moves the filter out of the renderContent method, so it does not get re-rendered.
  // TODO: Fix #187 and #186 and remove this workaround.
  const updateRef = React.useRef<(() => void) | null>(null);

  function renderContent(
    queryResult: QueryResult,
    update: () => void
  ): JSX.Element {
    // Convert the query result to an object, react-graph-vis understands.
    const graphData = convertQueryResult(queryResult);

    // Build the react-graph-vis graph options.
    const options = buildOptions(containerSize.width, containerSize.height);

    updateRef.current = update;

    return (
      <>
        <div className={classes.graphContainer}>
          <VisGraph graph={graphData} options={options} key={uuid()} />
        </div>
      </>
    );
  }

  const graphView = fetchDataFromService(
    executeFilterQuery,
    renderContent,
    filterService,
    filterQueryRef
  );

  const executeQuery = (query: FilterQuery): void => {
    filterQueryRef.current = query;
    const update = updateRef.current;

    if (typeof update === 'function') {
      update();
    }
  };

  return (
    <>
      <div
        // ref sizeMeasureContainerRef to classes.sizeMeasureContainer to compute containerSize.width and containerSize.height
        className={classes.sizeMeasureContainer}
        ref={sizeMeasureContainerRef}
      />
      <div className={classes.graphPage}>
        {graphView}
        <div className={classes.filter}>
          <Filter executeQuery={executeQuery} />
        </div>
      </div>
    </>
  );
}

export default Graph;
