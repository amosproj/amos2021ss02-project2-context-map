import React from 'react';
import { ContainerSize } from '../utils/useSize';
import Schema from './Schema';
import GraphPage from './GraphPage';

function SchemaPage(): JSX.Element {
  const content = (containerSize: ContainerSize) => (
    <Schema containerSize={containerSize} />
  );

  return <GraphPage content={content} />;
}

export default SchemaPage;
