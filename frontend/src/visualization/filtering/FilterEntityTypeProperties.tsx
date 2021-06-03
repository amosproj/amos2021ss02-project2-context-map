import Button from '@material-ui/core/Button';
import React from 'react';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FilterEntityTypePropertiesPropertyValues from './FilterEntityTypePropertiesPropertyValues';
import { FilterModelEntry } from '../../shared/filter';
import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
} from '../../shared/queries';
import useArrayState from './helpers/useArrayState';
import FilterPropertyModel from './helpers/FilterPropertyModel';
import useService from '../../dependency-injection/useService';
import NodeFilterConditionStore from '../../stores/NodeFilterConditionStore';
import EdgeFilterConditionStore from '../../stores/EdgeFilterConditionStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    dialog: {
      marginTop: theme.spacing(2),
    },
  })
);

const FilterEntityTypeProperties = (props: {
  filterOpen: boolean;
  handleCloseFilter: () => void;
  filterModelEntries: FilterModelEntry[];
  entity: 'node' | 'edge';
}): JSX.Element => {
  const classes = useStyles();

  const { filterOpen, handleCloseFilter, filterModelEntries, entity } = props;

  const entityFilterConditionStore =
    entity === 'node'
      ? useService<NodeFilterConditionStore>(NodeFilterConditionStore)
      : useService<EdgeFilterConditionStore>(EdgeFilterConditionStore);

  const [properties, setProperties] = useArrayState<FilterPropertyModel>(
    filterModelEntries.map(
      (entry) => ({ ...entry, selectedValues: null } as FilterPropertyModel)
    )
  );

  const entitySelects = properties.map((property, index) => (
    <FilterEntityTypePropertiesPropertyValues
      property={property}
      setProperty={setProperties[index]}
    />
  ));

  const handleApplyFilter = () => {
    const filterConditions: FilterCondition[] = [];

    for (const entry of properties) {
      // There is a filter specified for the property
      if (entry.selectedValues !== null && entry.selectedValues.length > 0) {
        // If only a single value is specified in the filter, add this directly
        // Example: name=Peter
        if (entry.selectedValues.length === 1) {
          filterConditions.push(
            MatchPropertyCondition(entry.key, entry.selectedValues[0])
          );
        } else {
          // There are multiple alternative filters specified for the property
          // Example: name=Peter|William|Chris
          // Combine these via MatchAny conditions.
          filterConditions.push(
            MatchAnyCondition(
              ...entry.selectedValues.map((value) =>
                MatchPropertyCondition(entry.key, value)
              )
            )
          );
        }
      }
    }

    if (filterConditions.length > 0) {
      entityFilterConditionStore.mergeState(
        MatchAllCondition(...filterConditions)
      );
    }
    handleCloseFilter();
  };

  return (
    <div>
      <Dialog
        open={filterOpen}
        onClose={handleCloseFilter}
        scroll="paper"
        className="FilterDialog"
      >
        <form className={classes.form}>
          <FormControl className={classes.dialog}>
            <DialogTitle>Filter Entity</DialogTitle>
            <DialogContent>{entitySelects}</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFilter} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilter}
                color="primary"
                className="ApplyFilter"
              >
                Apply Filter
              </Button>
            </DialogActions>
          </FormControl>
        </form>
      </Dialog>
    </div>
  );
};

export default FilterEntityTypeProperties;
