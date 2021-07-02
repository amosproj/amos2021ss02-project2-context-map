import React from 'react';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import VisGraph from 'react-graph-vis';
import { uuid } from 'uuidv4';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useService from '../dependency-injection/useService';
import SchemaStore from '../stores/SchemaStore';
import useObservable from '../utils/useObservable';
import { convertSchema } from './shared-ops/convertQueryResult';
import { EntityStyleStore } from '../stores/colors/EntityStyleStore';
import { ContainerSize } from '../utils/useSize';

const useStyles = makeStyles(() =>
  createStyles({
    graphContainer: {
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
  })
);

/**
 * Builds the graph options passed to react-graph-vis.
 * @param width The width of the graph.
 * @param height The height of the graph.
 * @returns The react-graph-vis options.
 */
function buildOptions(width: number, height: number) {
  return {
    edges: {
      color: '#000000',
    },
    width: `${width}px`,
    height: `${height}px`,
  };
}

function Schema(props: { containerSize: ContainerSize }): JSX.Element {
  const { containerSize } = props;
  const classes = useStyles();

  const schemaStore = useService(SchemaStore);
  const entityStyleStore = useService(EntityStyleStore);

  const graphData = useObservable(
    combineLatest([schemaStore.getState(), entityStyleStore.getState()]).pipe(
      map((next) => convertSchema(next[0], next[1]))
    ),
    { edges: [], nodes: [] }
  );

  return (
    <div className={classes.graphContainer}>
      <VisGraph
        graph={graphData}
        options={buildOptions(containerSize.width, containerSize.height)}
        key={uuid()}
      />
    </div>
  );
}

export default Schema;
