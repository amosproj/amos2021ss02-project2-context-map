import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  createStyles,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
import { FilterModelEntry } from '../../../../shared/filter';
import FilterPropertyModel from '../../FilterPropertyModel';

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      width: 200,
    },
  })
);

const EntityPropertySelect = (props: {
  entityType: FilterModelEntry;
  filterModelEntry: FilterPropertyModel;
  setFilterModelEntry: React.Dispatch<
    React.SetStateAction<FilterPropertyModel>
  >;
}): JSX.Element => {
  const classes = useStyles();
  const { entityType, filterModelEntry, setFilterModelEntry } = props;

  // utils from material ui multiselect https://material-ui.com/components/selects/#select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name: string, pName: string[], theme: Theme) {
    return {
      fontWeight:
        pName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterModelEntry({
      ...filterModelEntry,
      selectedValues: event.target.value as string[],
    });
  };

  return (
    <div>
      <FormControl className={classes.select}>
        <InputLabel>{entityType.key}</InputLabel>
        <Select
          multiple
          value={(filterModelEntry.selectedValues ?? []) as string[]}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {entityType.values.map((name) => (
            <MenuItem
              key={typeof name === 'string' ? name : 'Error: No string'}
              value={typeof name === 'string' ? name : 'Error: No string'}
              style={getStyles(
                typeof name === 'string' ? name : 'Error: No string',
                filterModelEntry.values as string[],
                theme
              )}
            >
              {typeof name === 'string' ? name : 'Error: No string'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default EntityPropertySelect;
