import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import ShortestPathNodeSelection from './ShortestPathNodeSelection';
import useService from '../../dependency-injection/useService';
import { ShortestPathStateStore } from '../../stores/shortest-path/ShortestPathStateStore';

/**
 * Menu where start and end node for shortest path can be selected
 */
export default function ShortestPathMenu(): JSX.Element {
  const stateStore = useService(ShortestPathStateStore);

  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [ignoreEdgeDirections, setIgnoreEdgeDirections] =
    useState<boolean>(false);

  // TODO: Init the state

  // Updates the state
  const startNodeChanged = (val: number | null): void => {
    stateStore.setStartNode(val);
    setStartNode(val);
  };

  const endNodeChanged = (val: number | null): void => {
    stateStore.setEndNode(val);
    setEndNode(val);
  };

  const ignoreEdgeDirectionsChanged = (val: boolean) => {
    stateStore.setIgnoreEdgeDirections(val);
    setIgnoreEdgeDirections(val);
  };

  return (
    <>
      <Box display="flex" p={1} fontWeight={500} fontSize={16}>
        Find shortest path
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection
          tail="start"
          node={startNode}
          nodeChanged={startNodeChanged}
        />
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection
          tail="end"
          node={endNode}
          nodeChanged={endNodeChanged}
        />
      </Box>
      <Box display="flex" p={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={ignoreEdgeDirections}
              onChange={(_, val) => ignoreEdgeDirectionsChanged(val)}
              name="ignore-edge-directions"
              color="primary"
            />
          }
          label="Ignore edge directions"
        />
      </Box>
    </>
  );
}
