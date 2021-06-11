import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '75vh', // TODO change/remove
      width: '35vh',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
  })
);

function Previews(): JSX.Element {
  const classes = useStyle();
  return (
    <Box className={`${classes.container} Previews`}>
      <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
        <Card>
          <CardMedia
            className={classes.media}
            image="/exploration-preview/structural layout.png"
            title="Paella dish"
          />
          <CardContent>Structural Layout</CardContent>
        </Card>
        <Card>
          <CardMedia
            className={classes.media}
            image="/exploration-preview/hierarchical layout.png"
            title="Paella dish"
          />
          <CardContent>Hierarchical Layout</CardContent>
        </Card>
      </Paper>
    </Box>
  );
}

export default Previews;
