import React from 'react';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import './Home.css';
import { deepPurple, pink, purple } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      display: 'block',
      margin: '3em 0 3em 0',
    },
    bold: {
      fontWeight: 400,
    },
    button: {
      color: '#fff',
      backgroundColor: deepPurple[500],
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
        <Grid item xs={4} direction="column">
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
          <Grid item xs={12}>
            <Typography variant="h3">WELCOME TO KMAP</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" display="inline" className={classes.bold}>
              FOR{' '}
              <Typography
                className={classes.highlight2}
                variant="h2"
                display="inline"
              >
                AUTOMATED INSIGHTS
              </Typography>
              ,<br />
              AND{' '}
              <Typography
                className={classes.highlight1}
                variant="h2"
                display="inline"
              >
                CODELESS ANSWERS
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={7} direction="column" alignContent="flex-start">
            <Typography>
              We are helping companies wordwide to automatically turn company
              data into valuable insights. A responsive step-by-step exploration
              facilitates quick access to the insights needed. KMAP furthers the
              communication and transparency across companies and along the
              value-chain.
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Button
              variant="contained"
              className={classes.button}
              href="#video"
            >
              Take a tour
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
