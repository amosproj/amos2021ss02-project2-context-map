import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { createStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: blue[500], // TODO change/remove
      height: '75vh', // TODO change/remove
    },
  })
);

function Previews(): JSX.Element {
  const classes = useStyle();
  return <Box className={`${classes.container} Previews`}>TODO</Box>;
}

export default Previews;
