import React from 'react';
import { Chip } from '@material-ui/core';

export default function NodeTypeComponent({
  name,
}: {
  name: string;
}): JSX.Element {
  return <Chip variant="outlined" size="small" label={name} color="primary" />;
}
