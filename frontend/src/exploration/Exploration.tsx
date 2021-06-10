import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import Previews from './previews/Previews';
import Questions from './questions/Questions';

const useStyle = makeStyles((theme) =>
  createStyles({
    container: {
      margin: theme.spacing(4),
      gap: theme.spacing(4),
    },
  })
);

function Exploration(): JSX.Element {
  const classes = useStyle();
  return (
    <>
      <h1>Exploration</h1>
      <Box
        className={classes.container}
        display="flex"
        justifyContent="space-around"
      >
        <Box flex={3}>
          <Previews />
        </Box>
        <Box flex={2}>
          <Questions />
        </Box>
      </Box>
    </>
  );
}

export default Exploration;
