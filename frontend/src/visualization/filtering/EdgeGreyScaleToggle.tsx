import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import { EntityStyleStore } from '../../stores/colors';
import useObservable from '../../utils/useObservable';

/**
 * Control that toggles colorization of the edges.
 */
export default function EdgeGreyScaleToggle(): JSX.Element {
  const entityStyleStore = useService(EntityStyleStore);

  // toggle greyScale
  const greyScale = useObservable(entityStyleStore.getGreyScaleEdges());

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={!greyScale}
            onChange={(_, val) => entityStyleStore.setGreyScaleEdges(!val)}
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Edges"
      />
    </Box>
  );
}
