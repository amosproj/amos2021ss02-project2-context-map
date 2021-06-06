import { Box } from '@material-ui/core';
import React from 'react';
import FilterLine from '../FilterLine';

const EntityTypeTemplate = (
  color: string,
  type: string,
  entity: 'node' | 'edge'
): JSX.Element => (
  <div>
    <Box display="flex" p={1}>
      <FilterLine backgroundColor={color} type={type} entity={entity} />
    </Box>
  </div>
);

export default EntityTypeTemplate;
