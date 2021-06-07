import React from 'react';
import { Box, Button } from '@material-ui/core';
import ShortestPathNodeSelection from './ShortestPathNodeSelection';

/**
 * Menu where start and end node for shortest path can be selected
 */
export default function ShortestPathMenu(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleStartShortestPath = () => {
    // TODO: compute shortest path.
  };

  return (
    <>
      <Box display="flex" p={1} fontWeight={500} fontSize={16}>
        Shortest path computation
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection end="start" />
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection end="end" />
      </Box>
      <Box display="flex" p={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartShortestPath}
        >
          Search
        </Button>
      </Box>
    </>
  );
}
