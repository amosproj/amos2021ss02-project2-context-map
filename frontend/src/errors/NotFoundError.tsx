import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '25px',
  },

  img: {
    width: '25%',
  },
});

function NotFoundErrorComponent(): JSX.Element {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <img
        src="../../errors/notFoundError.png"
        className={classes.img}
        alt=""
      />
      <h1>NotFoundError</h1>
      <p>Page not found</p>
    </Box>
  );
}

export default NotFoundErrorComponent;
