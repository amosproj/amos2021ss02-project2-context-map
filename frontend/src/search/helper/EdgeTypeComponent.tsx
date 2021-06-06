import React from 'react';
import { Chip } from '@material-ui/core';
import { EntityColorizer } from '../../stores/colors';
import { EdgeDescriptor } from '../../shared/entities';

export default function EdgeTypeComponent({
  type,
  edge,
  colorize,
}: {
  type: string;
  edge: EdgeDescriptor;
  colorize: EntityColorizer | undefined;
}): JSX.Element {
  const color = colorize !== undefined ? colorize(edge).color : '#3f51b5';

  return (
    <Chip
      variant="outlined"
      size="small"
      label={type}
      style={{ color, borderColor: color }}
    />
  );
}
