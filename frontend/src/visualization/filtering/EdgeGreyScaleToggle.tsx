import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import { EntityColorStore } from '../../stores/colors';
import useObservable from '../../utils/useObservable';

/**
 * Control that toggles colorization of the edges.
 */
export default function EdgeGreyScaleToggle(): JSX.Element {
  const entityColorStore = useService(EntityColorStore);

  // toggle greyScale
  const greyScale = useObservable(entityColorStore.getGreyScaleEdges());

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={!greyScale}
            onChange={(_, val) => entityColorStore.setGreyScaleEdges(!val)}
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Edges"
      />
    </Box>
  );
}
