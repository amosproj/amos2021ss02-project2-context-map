import React from 'react';
import { Chip } from '@material-ui/core';

export default function EdgeTypeComponent({
  type,
}: {
  type: string;
}): JSX.Element {
  return (
    <Chip variant="outlined" size="small" label={type} color="secondary" />
  );
}
