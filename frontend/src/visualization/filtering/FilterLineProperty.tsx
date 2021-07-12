import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  createStyles,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import useService from '../../dependency-injection/useService';
import FilterStateStore from '../../stores/filterState/FilterStateStore';
import { FilterModelEntry } from '../../shared/filter';

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      width: '25vw',
    },
  })
);

/**
 * Allows the user to select property values of given property names and writes
 * these to the {@link FilterStateStore}.
 */
const FilterLineProperty = (props: {
  filterModelEntry: FilterModelEntry;
  filterLineType: string;
  entity: 'node' | 'edge';
  setFilterProperty: (key: string, values: string[]) => void;
}): JSX.Element => {
  const classes = useStyles();
  const { filterModelEntry, filterLineType, entity, setFilterProperty } = props;

  const filterStateStore = useService(FilterStateStore);

  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    filterStateStore
      .getValue()
      .getPropertyStateValues(filterLineType, filterModelEntry.key, entity) ??
      []
  );

  // update filterStateStore here because selectedValues will first be updated in the next render
  useEffect(() => {
    setFilterProperty(filterModelEntry.key, selectedValues);
  }, [selectedValues]);

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
    setSelectedValues(event.target.value as string[]);
  };

  /**
   * Returns the property as string or returns an error string.
   * Does return the 'real' value if the property is of type string, boolean,
   * number or array.
   * @param property value
   */
  const asString = (property: unknown): string => {
    if (Array.isArray(property)) {
      return `[${property.map(asString).join(', ')}]`;
    }

    switch (typeof property) {
      case 'string':
      case 'boolean':
      case 'number':
        return `${property}`;
      default:
        return 'Error: No string';
    }
  };

  return (
    <div className="FilterSelect">
      <FormControl className={classes.select}>
        <InputLabel>{filterModelEntry.key}</InputLabel>
        <Select
          multiple
          value={(selectedValues ?? []) as string[]}
          onChange={handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {filterModelEntry.values
            .map(asString)
            .sort((a, b) => a.localeCompare(b))
            .map((value) => (
              <MenuItem
                key={value}
                value={value}
                style={getStyles(
                  value,
                  filterModelEntry.values as string[],
                  theme
                )}
              >
                {value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default FilterLineProperty;
