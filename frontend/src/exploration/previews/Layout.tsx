import {
  Card,
  CardContent,
  CardMedia,
  ListItem,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
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

function Layout(layout: {
  text: string;
  description: string;
  weight: number;
}): JSX.Element {
  const classes = useStyle();

  const { text, description } = layout;
  const imagePath = '/exploration-preview/'.concat(text, '.png');

  return (
    <>
      <ListItem>
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={imagePath} />
          <CardContent>{description}</CardContent>
        </Card>
      </ListItem>
    </>
  );
}

export default Layout;
