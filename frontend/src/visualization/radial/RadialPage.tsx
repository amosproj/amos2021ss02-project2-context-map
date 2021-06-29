import { Box } from '@material-ui/core';
import React from 'react';

export default function RadialPage(): JSX.Element {
  return (
    <Box p={3}>
      <h1>Radial Layout</h1>
      <p>Coming soon...</p>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <img
          src="/exploration-preview/radial-layout.png"
          alt="Radial"
          style={{ maxHeight: '75vh' }}
        />
      </div>
    </Box>
  );
}
