import React, { useRef, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import useResizeObserver from '@react-hook/resize-observer';
import Previews from './previews/Previews';
import Questions from './questions/Questions';

type StyleProps = {
  previewHeaderHeight: number;
};

const useStyle = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    container: {
      margin: theme.spacing(10),
      // top margin should be a bit smaller
      marginTop: theme.spacing(5),
      gap: theme.spacing(4),
    },
    questions: (props) => ({
      marginTop: props.previewHeaderHeight,
    }),
  })
);

function Exploration(): JSX.Element {
  // ref to the main content container
  const containerRef = useRef<HTMLDivElement>(null);

  // height of the header of the preview
  const [previewHeaderHeight, setPreviewHeaderHeight] = useState<number>(0);

  // Whenever the document resizes, calculate the height of the the header of the previews
  // so that the questions are on the same height as the preview card.
  // Used in favor to fixes pixels in order to react on a possible multi lined header.
  useResizeObserver(containerRef, () => {
    setPreviewHeaderHeight(
      document.querySelector('.Previews h1')?.getBoundingClientRect().height ??
        0
    );
  });

  const classes = useStyle({ previewHeaderHeight });
  return (
    <Box p={3}>
      <h1 id="ExplorationHeader">Exploration</h1>
      <div ref={containerRef}>
        <Box className={classes.container} display="flex">
          <Box flex={3} className={classes.questions}>
            <Questions />
          </Box>
          <Box flex={2}>
            <Previews />
          </Box>
        </Box>
      </div>
    </Box>
  );
}

export default Exploration;
