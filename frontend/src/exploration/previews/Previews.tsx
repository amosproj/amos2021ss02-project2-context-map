import React from 'react';
import { Box, List, makeStyles, Paper } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import Layout from './Layout';
import layoutsData from './layoutsData';
import useService from '../../dependency-injection/useService';
import ExplorationStore from '../../stores/exploration/ExplorationStore';
import useObservable from '../../utils/useObservable';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '75vh',
      width: '35vh',
    },
  })
);

function Previews(): JSX.Element {
  const classes = useStyle();

  const explorationStore = useService(ExplorationStore);

  const weights: { [key: string]: number } = useObservable(
    explorationStore.getScoreState(),
    {
      C: 0,
      BC: 0,
      H: 0,
      R: 0,
      SP: 0,
      L: 0,
      P: 0,
    }
  );

  for (const weightKeys of Object.keys(weights)) {
    layoutsData[weightKeys].weight = weights[weightKeys];
  }

  const layoutsArray = [];

  for (const elem of Object.values(layoutsData)) {
    layoutsArray.push(elem);
  }

  layoutsArray.sort((a, b) => {
    if (a.weight > b.weight) {
      return -1;
    }
    if (a.weight < b.weight) {
      return 1;
    }
    return 0;
  });

  const layoutsTemplate = layoutsArray.map((elem) => Layout(elem));

  return (
    <Box className={`${classes.container} Previews`}>
      <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>{layoutsTemplate}</List>
      </Paper>
    </Box>
  );
}

export default Previews;
