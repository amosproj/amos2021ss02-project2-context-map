import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import { EntityColorStore } from '../../stores/colors';

/**
 * Control that toggles colorization of the graph.
 */
export default function GreyScaleToggle(): JSX.Element {
  const entityColorStore = useService(EntityColorStore);

  // toggle greyScale
  const [colorize, setGreyScale] = useState<boolean>(true);

  // update the state
  const updateGreyScale = (val: boolean) => {
    entityColorStore.setGreyScale(val);
    setGreyScale(val);
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={!entityColorStore.getGreyScale()}
            onChange={(_, val) => updateGreyScale(!val)}
            name="colorize-graph"
            color="primary"
          />
        }
        label="Colorize Graph"
      />
    </>
  );
}
