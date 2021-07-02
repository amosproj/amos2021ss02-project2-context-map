import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GraphPage from './GraphPage';
import { ContainerSize } from '../utils/useSize';
import Graph from './Graph';
import Filter from './filtering/Filter';

const useStyles = makeStyles(() =>
  createStyles({
    Filter: {
      // high zIndex so content is in the foreground
      zIndex: 1500,
    },
  })
);

function GraphEntityPage(props: { layout?: string }): JSX.Element {
  const classes = useStyles();
  const { layout } = props;

  const content = (containerSize: ContainerSize, layoutCur?: string) => (
    <>
      <Graph layout={layoutCur} containerSize={containerSize} />
      <div className={classes.Filter}>
        <Filter />
      </div>
    </>
  );

  return <GraphPage layout={layout} content={content} />;
}

GraphEntityPage.defaultProps = {
  layout: undefined,
};

export default GraphEntityPage;
