import {
  Card,
  CardContent,
  CardMedia,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles } from '@material-ui/core/styles';
import LayoutDefinition from './LayoutDefinition';

const useStyle = makeStyles(() =>
  createStyles({
    card: {
      width: '100%',
    },
  })
);

/**
 * A Preview of a Layout that routes to the tab path from the input parameter.
 * @param layout - Data used to construct the card
 */
function LayoutCard(layout: LayoutDefinition): JSX.Element {
  const classes = useStyle();

  const { filename, description, path } = layout;

  const imagePath = `/exploration-preview/${filename}`;

  return (
    <ListItem>
      <Link to={path} style={{ textDecoration: 'none' }}>
        <Card className={`${classes.card} LayoutPreview`}>
          <CardMedia
            component="img"
            image={imagePath}
            alt={`Preview of ${description}`}
          />
          <CardContent>
            <Typography variant="h6">{description}</Typography>
          </CardContent>
        </Card>
      </Link>
    </ListItem>
  );
}

export default LayoutCard;
