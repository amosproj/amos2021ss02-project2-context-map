import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { createStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: red[500], // TODO change/remove
      height: '75vh', // TODO change/remove
    },
  })
);

function Questions(): JSX.Element {
  const classes = useStyle();
  return <Box className={`${classes.container} Questions`}>TODO</Box>;
}

export default Questions;
