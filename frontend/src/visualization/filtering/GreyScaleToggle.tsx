import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import { EntityColorStore } from '../../stores/colors';

/**
 * Control that toggles colorization of the graph.
 */
export default function GreyScaleToggle(): JSX.Element {
  const entityColorStore = useService(EntityColorStore);

  // toggle greyScale
  const [colorize, setGreyScale] = useState<boolean>(
    !entityColorStore.getGreyScale()
  );

  // update the state
  const updateGreyScale = (val: boolean) => {
    entityColorStore.setGreyScale(val);
    setGreyScale(!val);
  };

  return (
    <Box p={3}>
      <FormControlLabel
        control={
          <Checkbox
            checked={colorize}
            onChange={(_, val) => updateGreyScale(!val)}
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Graph"
      />
    </Box>
  );
}
