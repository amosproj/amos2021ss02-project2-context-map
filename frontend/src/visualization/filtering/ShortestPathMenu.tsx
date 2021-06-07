import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ShortestPathNodeSelection from './ShortestPathNodeSelection';

/**
 * Menu where start and end node for shortest path can be selected
 */
export default function ShortestPathMenu(): JSX.Element {
  const [errorSpecified, setErrorSpecified] = useState(false);

  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);

  const handleStartShortestPath = () => {
    if (startNode !== null && endNode !== null) {
      setErrorSpecified(false);
      // TODO: compute shortest path. Use startNode and endNode.
    } else {
      setErrorSpecified(true);
    }
  };

  return (
    <>
      <Box display="flex" p={1} fontWeight={500} fontSize={16}>
        Find shortest path
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection end="start" setNode={setStartNode} />
      </Box>
      <Box display="flex" p={1}>
        <ShortestPathNodeSelection end="tail" setNode={setEndNode} />
      </Box>
      <Box display="flex" p={1}>
        <Button
          className="StartShortestPath"
          variant="contained"
          color="primary"
          onClick={handleStartShortestPath}
        >
          Search
        </Button>
      </Box>
      <Box display="flex" p={1}>
        {errorSpecified && (
          <Alert className="ShortestPathNodesNotSpecified" severity="error">
            Specify start and end node!
          </Alert>
        )}
      </Box>
    </>
  );
}
