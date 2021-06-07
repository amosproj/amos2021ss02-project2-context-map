import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import FilterQueryStore from '../../stores/FilterQueryStore';

/**
 * Control that toggles the visibility of subsidiary nodes.
 */
export default function SubsidiaryNodesToggle(): JSX.Element {
  const filterQueryStore = useService(FilterQueryStore);

  // number of edges and nodes
  const [includeSubsidiary, setIncludeSubsidiary] = useState<boolean>(true);

  // Updates the state
  const updateIncludeSubsidiary = (val: boolean) => {
    filterQueryStore.mergeState({ includeSubsidiary: val });
    setIncludeSubsidiary(val);
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={includeSubsidiary}
            onChange={(_, val) => updateIncludeSubsidiary(val)}
            name="show-subsidiary"
            color="primary"
          />
        }
        label="Show subsidiary"
      />
    </>
  );
}
