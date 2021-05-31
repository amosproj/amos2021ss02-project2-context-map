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
import FilterPropertyModel from '../../FilterPropertyModel';

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      width: 200,
    },
  })
);

const EntityPropertySelect = (props: {
  property: FilterPropertyModel;
  setProperty: React.Dispatch<React.SetStateAction<FilterPropertyModel>>;
}): JSX.Element => {
  const classes = useStyles();
  const { property, setProperty } = props;

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

  function getStyles(name: string, pName: string[], styles: Theme) {
    return {
      fontWeight:
        pName.indexOf(name) === -1
          ? styles.typography.fontWeightRegular
          : styles.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProperty({
      ...property,
      selectedValues: event.target.value as string[],
    });
  };

  return (
    <div className="FilterSelect">
      <FormControl className={classes.select}>
        <InputLabel>{property.key}</InputLabel>
        <Select
          multiple
          value={(property.selectedValues ?? []) as string[]}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {property.values.map((name) => (
            <MenuItem
              key={typeof name === 'string' ? name : 'Error: No string'}
              value={typeof name === 'string' ? name : 'Error: No string'}
              style={getStyles(
                typeof name === 'string' ? name : 'Error: No string',
                property.values as string[],
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
