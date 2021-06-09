import React from 'react';
import { Chip } from '@material-ui/core';

export default function EdgeTypeComponent({
  type,
  color,
}: {
  type: string;
  color: string;
}): JSX.Element {
  return (
    <Chip
      variant="outlined"
      size="small"
      label={type}
      style={{ color, borderColor: color }}
    />
  );
}
