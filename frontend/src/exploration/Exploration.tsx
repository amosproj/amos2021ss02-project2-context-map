import React from 'react';
import { Box, Grid } from '@material-ui/core';
import Previews from './previews/Previews';
import Questions from './questions/Questions';

function Exploration(): JSX.Element {
  return (
    <Box p={3}>
      <h1 id="ExplorationHeader">Exploration</h1>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={8}>
          <Questions />
        </Grid>
        <Grid item xs={3}>
          <Previews />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Exploration;
