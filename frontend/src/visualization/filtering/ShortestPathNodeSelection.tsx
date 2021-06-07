import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { map } from 'rxjs/operators';
import useService from '../../dependency-injection/useService';
import QueryResultStore from '../../stores/QueryResultStore';
import useObservable from '../../utils/useObservable';

export default function ShortestPathNodeSelection(props: {
  end: 'start' | 'end';
}): JSX.Element {
  const { end } = props;

  const queryResultStore = useService(QueryResultStore);

  const nodeIds =
    useObservable(
      queryResultStore
        .getState()
        .pipe(map((next) => next.nodes.map((n) => n.id)))
    ) ?? [];
  return (
    <>
      <Autocomplete
        id="combo-box-demo"
        options={nodeIds}
        getOptionLabel={(option) => option.toString()}
        style={{ width: 500 }}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} label={end} variant="outlined" />
        )}
      />
    </>
  );
}
