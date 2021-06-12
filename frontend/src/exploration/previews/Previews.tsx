import React from 'react';
import { Box, List, makeStyles, Paper } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import LayoutCard from './LayoutCard';
import useService from '../../dependency-injection/useService';
import ExplorationStore from '../../stores/exploration/ExplorationStore';
import useObservable from '../../utils/useObservable';
import layoutsData from './layoutsData';
import { ExplorationWeight } from '../../stores/exploration';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
    },
  })
);

/**
 * List of {@link LayoutCard}s with ordering based on a {@link ExplorationWeight} from {@link ExplorationStore}.
 */
function Previews(): JSX.Element {
  const classes = useStyle();

  const explorationStore = useService(ExplorationStore);

  const weights = useObservable(
    explorationStore.getScoreState(),
    explorationStore.getScoreValue()
  );

  const layoutsPreviewData = (
    Object.keys(weights) as (keyof ExplorationWeight)[]
  )
    .sort((a, b) => weights[a] - weights[b])
    .map((layout) => layoutsData[layout]);

  return (
    <Box className={`${classes.container} Previews`}>
      <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>{layoutsPreviewData.map((elem) => LayoutCard(elem))}</List>
      </Paper>
    </Box>
  );
}

export default Previews;
