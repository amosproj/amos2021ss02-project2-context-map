import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: 150,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ].join(','),
    '&:hover': {
      boxShadow: 'none',
    },
  },
});

const EntityFilterElement = (props: {
  backgroundColor: string;
  boxShadow: string;
  content: string;
}): JSX.Element => {
  const { backgroundColor, boxShadow, content } = props;
  const classes = useStyles();

  return (
    <Button
      style={{ backgroundColor, boxShadow }}
      variant="contained"
      color="primary"
      disableRipple
      className={classes.root}
    >
      {content}
    </Button>
  );
};

export default EntityFilterElement;
