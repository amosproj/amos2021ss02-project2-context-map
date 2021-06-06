import React from 'react';
import { Chip } from '@material-ui/core';
import { NodeDescriptor } from '../../shared/entities';
import { EntityColorizer } from '../../stores/colors';

export default function NodeTypeComponent({
  name,
  node,
  colorize,
}: {
  name: string;
  node: NodeDescriptor;
  colorize: EntityColorizer | undefined;
}): JSX.Element {
  const color = colorize !== undefined ? colorize(node).color : '#3f51b5';

  return (
    <Chip
      variant="outlined"
      size="small"
      label={name}
      style={{ color, borderColor: color }}
    />
  );
}
