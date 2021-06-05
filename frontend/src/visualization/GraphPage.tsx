import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { useSize } from '../utils/useSize';
import Filter from './filtering/Filter';

import Graph from './Graph';

const useStyles = makeStyles(() =>
  createStyles({
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    graphPage: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
    },
    Filter: {
      // high zIndex so content is in the foreground
      zIndex: 1500,
    },
  })
);

type GraphProps = {
  layout?: string;
};

function GraphPage(props: GraphProps): JSX.Element {
  const { layout } = props;
  const classes = useStyles();

  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = React.useRef<HTMLDivElement>(null);

  // The size of the container that is used to measure the available space for the graph.
  const containerSize = useSize(sizeMeasureContainerRef);

  return (
    <>
      <div
        // ref sizeMeasureContainerRef to classes.sizeMeasureContainer to compute containerSize.width and containerSize.height
        className={classes.sizeMeasureContainer}
        ref={sizeMeasureContainerRef}
      />
      <div className={classes.graphPage}>
        <Graph layout={layout} containerSize={containerSize} />
        <div className={classes.Filter}>
          <Filter />
        </div>
      </div>
    </>
  );
}

GraphPage.defaultProps = {
  layout: undefined,
};

export default GraphPage;
