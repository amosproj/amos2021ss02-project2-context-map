import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import useService from '../dependency-injection/useService';
import SearchSelectionStore from '../stores/SearchSelectionStore';
import useObservable from '../utils/useObservable';

function Data(): JSX.Element {
  const searchSelectionStore = useService(SearchSelectionStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO handle search selection
  const searchSelection = useObservable(searchSelectionStore.getState());

  // on unmount: clear search
  useEffect(() => () => searchSelectionStore.setState(undefined), []);

  return (
    <Box p={3}>
      <h1>Data</h1>
      <p>Coming soon...</p>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <img
          src="/exploration-preview/data-table.png"
          alt="Betweenness"
          style={{ maxWidth: '100%', maxHeight: '75vh' }}
        />
      </div>{' '}
    </Box>
  );
}

export default Data;
