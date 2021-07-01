import React from 'react';
import { Box, Button, Icon } from '@material-ui/core';
import useService from '../../dependency-injection/useService';
import FilterStateStore from '../../stores/filterState/FilterStateStore';
import SchemaStore from '../../stores/SchemaStore';
import FilterQueryStore from '../../stores/FilterQueryStore';
import ShortestPathStateStore from '../../stores/shortest-path/ShortestPathStateStore';

export default function Reset(): JSX.Element {
  const filterStateStore = useService(FilterStateStore);
  const filterQueryStore = useService(FilterQueryStore);
  const schemaStore = useService(SchemaStore);
  const shortestPathStore = useService(ShortestPathStateStore);

  const handleReset = () => {
    filterStateStore.initFromSchema(schemaStore.getValue());
    shortestPathStore.reset();
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
