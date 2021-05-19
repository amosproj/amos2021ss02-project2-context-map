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

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      width: 200,
    },
  })
);

const EntityPropertySelect = (props: {
  entityType: FilterModelEntry;
}): JSX.Element => {
  const classes = useStyles();
  const { entityType } = props;
  const [personName, setPersonName] = React.useState<string[]>([]);

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
    setPersonName(event.target.value as string[]);
  };

  return (
    <div>
      <FormControl className={classes.select}>
        <InputLabel>{entityType.key}</InputLabel>
        <Select
          multiple
          value={personName}
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
                personName,
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
