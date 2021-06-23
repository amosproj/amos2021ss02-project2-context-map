import React, { createRef } from 'react';
import { Box, makeStyles, Paper } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import LayoutCard from './LayoutCard';
import useService from '../../dependency-injection/useService';
import ExplorationStore from '../../stores/exploration/ExplorationStore';
import useObservable from '../../utils/useObservable';
import layoutsData from './layoutsData';
import { ExplorationWeight } from '../../stores/exploration';
import AnimatedList from '../../common/AnimatedList/AnimatedList';

const useStyle = makeStyles(() =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
    },
    paper: {
      maxHeight: '100%',
      overflow: 'auto',
      maxWidth: '22em',
      margin: 'auto',
    },
    header: {
      margin: 0,
      textAlign: 'center',
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
    .sort((a, b) => weights[b] - weights[a] || a.localeCompare(b))
    .map((layout) => layoutsData[layout]);

  return (
    <Box className={`${classes.container} Previews`}>
      <h1 className={classes.header}>Recommended Visualisations</h1>
      <Paper className={classes.paper}>
        <AnimatedList>
          {layoutsPreviewData.map((preview) => (
            <div key={preview.description} ref={createRef()}>
              <LayoutCard
                filename={preview.filename}
                description={preview.description}
                path={preview.path}
              />
            </div>
          ))}
        </AnimatedList>
      </Paper>
    </Box>
  );
}

export default Previews;
