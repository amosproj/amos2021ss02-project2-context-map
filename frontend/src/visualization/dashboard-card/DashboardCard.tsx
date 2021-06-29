import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import { CardPresentationContent } from './cardContents';

const useStyles = makeStyles({
  root: {
    textDecoration: 'none',
    height: '100%',
  },
  h100: {
    height: '100%',
  },
});

export default function DashboardCard(
  card: CardPresentationContent
): JSX.Element {
  const { path, label, subLabel, description, icon } = card;
  const classes = useStyles();

  return (
    <Link className={classes.root} to={path}>
      <Card className={classes.h100}>
        <CardHeader
          avatar={<Icon>{icon}</Icon>}
          title={
            <Typography variant="h5" component="h2">
              {label}
            </Typography>
          }
          subheader={subLabel}
        />
        <CardContent>
          <Typography variant="body2" component="p">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
