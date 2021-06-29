import { Box } from '@material-ui/core';
import React from 'react';

export default function BetweennessPage(): JSX.Element {
  return (
    <Box p={3}>
      <h1>Betweenness</h1>
      <p>Coming soon...</p>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <img
          src="/exploration-preview/betweenness-centrality.png"
          alt="Betweenness"
          style={{ maxWidth: '100%', maxHeight: '75vh' }}
        />
      </div>
    </Box>
  );
}
