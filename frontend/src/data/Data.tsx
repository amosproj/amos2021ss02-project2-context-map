import { Box } from '@material-ui/core';
import React from 'react';

function Data(): JSX.Element {
  return (
    <Box p={3}>
      <h1>Data</h1>
      <p>Coming soon...</p>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <img
          src="/exploration-preview/data-table.png"
          alt="Betweenness"
          style={{ maxWidth: '100%', maxHeight: '75vh' }}
        />
      </div>{' '}
    </Box>
  );
}

export default Data;
