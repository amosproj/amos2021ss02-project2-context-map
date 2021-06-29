import React from 'react';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import { common, pink } from '@material-ui/core/colors';
import Typed from 'react-typed';
import HomeVideoModal from './HomeVideoModal';

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      display: 'block',
      marginTop: 'auto',
      marginBottom: 'auto',
      width: '100%',
      padding: '5px',
    },
    bold: {
      fontWeight: 400,
    },
    highlightText: {
      fontWeight: 400,
      color: pink[500],
    },
    bgWhite: {
      backgroundColor: common.white,
    },
    h100: {
      height: '100%',
    },
  })
);

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={`${classes.h100} ${classes.bgWhite}`}>
      {/* Splits Page Horizontally */}
      <Grid container spacing={0} className={classes.h100}>
        {/* Left side */}
        <Grid container item xs={5} direction="column">
          <img className={classes.img} src="home.png" alt="no-src" />
        </Grid>
        {/* Spacer between left and right side */}
        <Grid item xs={1} />
        {/* Right side */}
        {/* Separate right side into rows, to control spacing */}
        <Grid
          item
          container
          xs={6}
          spacing={3}
          direction="row"
          alignContent="center"
        >
          {/* Right side row, full width */}
          <Grid item xs={12}>
            <Typography variant="h4">WELCOME TO KMAP</Typography>
          </Grid>
          {/* Right side row, full width */}
          <Grid item xs={12}>
            <Typography variant="h2" display="inline" className={classes.bold}>
              A CONTEXT MAP PROVIDING
              <br />
              <Typography
                variant="h2"
                display="inline"
                className={classes.highlightText}
              >
                <Typed
                  strings={[
                    'AUTOMATED INSIGHTS.',
                    'CODELESS ANSWERS.',
                    'MODULAR VISUALIZATIONS.',
                    'STEP-BY-STEP EXPLORATION.',
                  ]}
                  typeSpeed={40}
                  loop
                />
              </Typography>
            </Typography>
          </Grid>
          {/* Right side row, medium width */}
          <Grid container item xs={7}>
            <Typography>
              We are helping companies wordwide to automatically turn company
              data into valuable insights. A responsive step-by-step exploration
              facilitates quick access to the insights needed. KMAP furthers the
              communication and transparency across companies and along the
              value-chain.
            </Typography>
          </Grid>
          {/* Right side row, medium width */}
          <Grid item xs={7} spacing={2} direction="row" justify="center">
            <HomeVideoModal />{' '}
            <img
              style={{ marginLeft: '50px' }}
              height="50"
              src="homeArrowHeads.png"
              alt="no-src"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
