import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import ShortestPathNodeSelection from './ShortestPathNodeSelection';
import useService from '../../dependency-injection/useService';
import { ShortestPathStateStore } from '../../stores/shortest-path/ShortestPathStateStore';
import useObservable from '../../utils/useObservable';

/**
 * Menu where start and end node for shortest path can be selected
 */
export default function ShortestPathMenu(): JSX.Element {
  const stateStore = useService(ShortestPathStateStore);
  const state = useObservable(stateStore.getState(), stateStore.getValue());

  // Updates the state
  const startNodeChanged = (val: number | null): void => {
    stateStore.setStartNode(val);
  };

  const endNodeChanged = (val: number | null): void => {
    stateStore.setEndNode(val);
  };

  const ignoreEdgeDirectionsChanged = (val: boolean) => {
    stateStore.setIgnoreEdgeDirections(val);
  };

  return (
    <Box p={3}>
      <Box display="flex" fontWeight={500} fontSize={16}>
        Find shortest path
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection
          tail="start"
          node={state.startNode}
          nodeChanged={startNodeChanged}
        />
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection
          tail="end"
          node={state.endNode}
          nodeChanged={endNodeChanged}
        />
      </Box>
      <Box display="flex" p={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.ignoreEdgeDirections}
              onChange={(_, val) => ignoreEdgeDirectionsChanged(val)}
              name="ignore-edge-directions"
              color="primary"
            />
          }
          label="Ignore edge directions"
        />
      </Box>
    </Box>
  );
}
