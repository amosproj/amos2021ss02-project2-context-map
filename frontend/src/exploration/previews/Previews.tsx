import React from 'react';
import { Box, List, makeStyles, Paper } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import LayoutCard from './LayoutCard';
import useService from '../../dependency-injection/useService';
import ExplorationStore from '../../stores/exploration/ExplorationStore';
import useObservable from '../../utils/useObservable';
import routes from '../../routing/routes';
import createLayoutCard, { layoutsData } from './layoutsData';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '75vh',
      width: '35vh',
    },
  })
);

/**
 * List of {@link LayoutCard}s with ordering based on a {@link ExplorationWeight} from {@link ExplorationStore}.
 */
function Previews(): JSX.Element {
  const classes = useStyle();

  const { tabs } = routes.Visualization;

  /* istanbul ignore if */
  if (tabs === undefined) {
    return <></>;
  }

  const explorationStore = useService(ExplorationStore);

  // weights from the store as a hashmap so it can be used as an iterable.
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

  // align the layoutsData weights with the weights from the store.
  for (const weightKeys of Object.keys(weights)) {
    layoutsData[weightKeys].weight = weights[weightKeys];
  }

  // convert layoutsData to an array so it can get sorted.
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

  // create LayoutCards from the sorted layoutsData.
  const layoutsTemplateData = layoutsArray.map((elem) =>
    createLayoutCard(elem, tabs)
  );

  return (
    <Box className={`${classes.container} Previews`}>
      <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>{layoutsTemplateData.map((elem) => LayoutCard(elem))}</List>
      </Paper>
    </Box>
  );
}

export default Previews;
