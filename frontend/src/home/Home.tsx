import React from 'react';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import './Home.css';
import { pink, purple } from '@material-ui/core/colors';
import HomeVideoModal from './HomeVideoModal';

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      display: 'block',
      margin: '3em 0 3em 0',
    },
    bold: {
      fontWeight: 400,
    },
    highlight1: {
      fontWeight: 400,
      color: purple[500],
    },
    highlight2: {
      fontWeight: 400,
      color: pink[500],
    },
  })
);

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      {/* Splits Page Horizontally */}
      <Grid container spacing={1}>
        {/* Left side */}
        <Grid container item xs={4} direction="column">
          <img className={classes.img} src="home.png" alt="no-src" />
        </Grid>
        {/* Spacer between left and right side */}
        <Grid item xs={1} />
        {/* Right side */}
        {/* Separate right side into rows, to control spacing */}
        <Grid
          item
          container
          xs={7}
          spacing={3}
          direction="row"
          alignContent="center"
        >
          {/* Right side row, full width */}
          <Grid item xs={12}>
            <Typography variant="h3">WELCOME TO KMAP</Typography>
          </Grid>
          {/* Right side row, full width */}
          <Grid item xs={12}>
            <Typography variant="h2" display="inline" className={classes.bold}>
              <span>FOR </span>
              <span className={classes.highlight2}>AUTOMATED INSIGHTS</span>
              ,<br />
              <span>AND </span>
              <span className={classes.highlight1}>CODELESS ANSWERS</span>
            </Typography>
          </Grid>
          {/* Right side row, medium width */}
          <Grid
            container
            item
            xs={7}
            direction="column"
            alignContent="flex-start"
          >
            <Typography>
              We are helping companies wordwide to automatically turn company
              data into valuable insights. A responsive step-by-step exploration
              facilitates quick access to the insights needed. KMAP furthers the
              communication and transparency across companies and along the
              value-chain.
            </Typography>
          </Grid>
          {/* Right side row, medium width */}
          <Grid item xs={7}>
            <HomeVideoModal />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
