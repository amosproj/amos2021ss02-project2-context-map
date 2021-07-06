import { createStyles, makeStyles } from '@material-ui/core/styles';

/**
 * Base styles for visualization layouts.
 */
const useStylesVisualization = makeStyles(() =>
  createStyles({
    graphContainer: {
      zIndex: 1200,
      position: 'relative',
      flexGrow: 1,
      overflowY: 'hidden',
      overflowX: 'hidden',
    },
  })
);

export default useStylesVisualization;
