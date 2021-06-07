import React, { ChangeEvent } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Popper, PopperProps, TextField } from '@material-ui/core';
import { map } from 'rxjs/operators';
import useService from '../../dependency-injection/useService';
import QueryResultStore from '../../stores/QueryResultStore';
import useObservable from '../../utils/useObservable';

/**
 * Selection of a start or an end node using a {@link Autocomplete}.
 */
export default function ShortestPathNodeSelection(props: {
  end: 'start' | 'end';
  setNode: React.Dispatch<React.SetStateAction<number | null>>;
}): JSX.Element {
  const { end, setNode } = props;

  const queryResultStore = useService(QueryResultStore);

  const nodeIds =
    useObservable(
      queryResultStore
        .getState()
        .pipe(map((next) => next.nodes.map((n) => n.id)))
    ) ?? [];

  const handleSetNode = (
    event: ChangeEvent<Record<string, unknown>>,
    newValue: number | null
  ) => {
    setNode(newValue);
  };

  // used to display selection in the foreground and placement on top of component
  const AutocompletePopper = (popperProps: PopperProps) => (
    <Popper
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...popperProps}
      disablePortal // displays selection in the foreground
      placement="top-start"
    />
  );

  return (
    <>
      <Autocomplete
        onChange={handleSetNode}
        options={nodeIds}
        getOptionLabel={(option) => option.toString()}
        style={{ width: 200 }}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label={end}
            variant="outlined"
            required
          />
        )}
        PopperComponent={AutocompletePopper}
        ListboxProps={{
          style: {
            maxHeight: '200px',
          },
        }}
      />
    </>
  );
}
