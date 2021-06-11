import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '75vh',
      width: '35vh',
    },
    card: {
      width: '100%',
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
        <List>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="/exploration-preview/structural layout.png"
                title="Paella dish"
              />
              <CardContent>Structural Layout</CardContent>
            </Card>
          </ListItem>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="/exploration-preview/hierarchical layout.png"
                title="Paella dish"
              />
              <CardContent>Hierarchical Layout</CardContent>
            </Card>
          </ListItem>
          <ListItem>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="/exploration-preview/empty layout.png"
                title="Paella dish"
              />
              <CardContent>Empty Layout</CardContent>
            </Card>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default Previews;
