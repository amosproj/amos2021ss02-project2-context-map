import {
  Card,
  CardContent,
  CardMedia,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { createStyles } from '@material-ui/core/styles';
import LayoutDefinition from './LayoutDefinition';

const useStyle = makeStyles(() =>
  createStyles({
    card: {
      width: '100%',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
  })
);

/**
 * A Preview of a Layout that routes to the tab path from the input parameter.
 * @param layout
 */
function LayoutCard(layout: LayoutDefinition): JSX.Element {
  const classes = useStyle();

  const { path, filename, description } = layout;

  const imagePath = '/exploration-preview/'.concat(filename, '.png');

  return (
    <a href={path} style={{ textDecoration: 'none' }}>
      <ListItem>
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={imagePath} />
          <CardContent>
            <Typography variant="h6">{description}</Typography>
          </CardContent>
        </Card>
      </ListItem>
    </a>
  );
}

export default LayoutCard;
