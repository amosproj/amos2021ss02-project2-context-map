import React from 'react';
import { Chip } from '@material-ui/core';

export default function NodeTypeComponent({
  name,
  color,
}: {
  name: string;
  color: string;
}): JSX.Element {
  return (
    <Chip
      variant="outlined"
      size="small"
      label={name}
      style={{ color, borderColor: color }}
    />
  );
}
