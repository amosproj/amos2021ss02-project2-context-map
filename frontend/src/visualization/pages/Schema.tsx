import React from 'react';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import VisGraph from 'react-graph-vis';
import { uuid } from 'uuidv4';
import useService from '../../dependency-injection/useService';
import SchemaStore from '../../stores/SchemaStore';
import useObservable from '../../utils/useObservable';
import convertSchema from '../shared-ops/convertSchema';
import { EntityStyleStore } from '../../stores/colors/EntityStyleStore';
import { ContainerSize } from '../../utils/useSize';
import { buildOptions, useStylesVisualization } from './shared-options';

function Schema(props: { containerSize: ContainerSize }): JSX.Element {
  const { containerSize } = props;
  const classes = useStylesVisualization();

  const schemaStore = useService(SchemaStore);
  const entityStyleStore = useService(EntityStyleStore);

  // Data used to visualize the schema.
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
