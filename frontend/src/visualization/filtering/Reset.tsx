import React from 'react';
import { Box, Button, Icon } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import FilterStateStore from '../../stores/filterState/FilterStateStore';
import FilterQueryStore from '../../stores/FilterQueryStore';
import ShortestPathStateStore from '../../stores/shortest-path/ShortestPathStateStore';
import EntityQueryLimitStore from '../../stores/EntityQueryLimitStore';

/**
 * Reset button used to reset all the stores that are used in the filter.
 */
export default function Reset(): JSX.Element {
  const filterStateStore = useService(FilterStateStore);
  const filterQueryStore = useService(FilterQueryStore);
  const entityCountsStore = useService(EntityQueryLimitStore);
  const shortestPathStore = useService(ShortestPathStateStore);

  const handleReset = () => {
    filterStateStore.reset();
    shortestPathStore.reset();
    entityCountsStore.reset();
    filterQueryStore.update();
  };

  return (
    <div>
      <Box p={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          endIcon={<Icon>cached</Icon>}
        >
          Reset
        </Button>
      </Box>
    </div>
  );
}
