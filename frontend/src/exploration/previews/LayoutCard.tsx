import {
  Card,
  CardContent,
  CardMedia,
  ListItem,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { createStyles } from '@material-ui/core/styles';
import LayoutDefinition from './LayoutDefinition';

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

function LayoutCard(layout: LayoutDefinition): JSX.Element {
  const classes = useStyle();

  const { path, filename, description } = layout;

  const imagePath = '/exploration-preview/'.concat(filename, '.png');

  return (
    <a href={path} style={{ textDecoration: 'none' }}>
      <ListItem>
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={imagePath} />
          <CardContent>{description}</CardContent>
        </Card>
      </ListItem>
    </a>
  );
}

export default LayoutCard;
