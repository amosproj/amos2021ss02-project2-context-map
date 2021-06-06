import { Box } from '@material-ui/core';
import React from 'react';
import FilterLine from '../FilterLine';

/**
 * Template for a {@link FilterLine} to simplify the assignment in {@link Filter}.
 * @param color - color of the entity
 * @param type - type of the entity
 * @param entity - specifies whether this entity is a node or an edge
 */
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
