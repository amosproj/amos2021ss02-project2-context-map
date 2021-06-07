import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import { EntityColorStore } from '../../stores/colors';
import useObservable from '../../utils/useObservable';

/**
 * Control that toggles colorization of the graph.
 */
export default function GreyScaleToggle(): JSX.Element {
  const entityColorStore = useService(EntityColorStore);

  // toggle greyScale
  const greyScale = useObservable(entityColorStore.getGreyScale());

  return (
    <Box p={3}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!greyScale}
            onChange={(_, val) => entityColorStore.setGreyScale(!val)}
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Graph"
      />
    </Box>
  );
}
