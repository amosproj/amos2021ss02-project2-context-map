import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import EntityStyleStateStore from '../../stores/colors/EntityStyleStateStore';
import useMonitor from '../../utils/useMonitor';

/**
 * Control that toggles colorization of the edges.
 */
export default function EdgeGreyScaleToggle(): JSX.Element {
  const styleStateStore = useService(EntityStyleStateStore);

  // toggle greyScale
  const styleState = useMonitor(styleStateStore);

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={!styleState.greyScaleEdges}
            onChange={(_, val) =>
              styleStateStore.mergeState({ greyScaleEdges: !val })
            }
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Edges"
      />
    </Box>
  );
}
