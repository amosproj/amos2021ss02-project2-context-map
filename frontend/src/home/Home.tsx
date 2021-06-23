import React from 'react';
import { createStyles, Grid, makeStyles, Button } from '@material-ui/core';
import './Home.css';

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      display: 'block',
    },
    centerColumn: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={4} direction="column" className={classes.centerColumn}>
          <img className={classes.img} src="home.png" alt="no-src" />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={6} direction="column" className={classes.centerColumn}>
          <h2>WELCOME TO KMAP</h2>
          <h1>FOR AUTOMATED INSIGHTS, AND CODELESS ANSWERS</h1>
          <hr />
          <p>
            We are helping companies wordwide to automatically turn company data
            into valuable insights. A responsive step-by-step exploration
            facilitates quick access to the insights needed. KMAP furthers the
            communication and transparency across companies and along the
            value-chain.
          </p>
          <Button variant="contained" color="primary" href="#video">
            Link
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
