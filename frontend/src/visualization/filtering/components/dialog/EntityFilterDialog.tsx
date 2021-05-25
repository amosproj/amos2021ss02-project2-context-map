import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import EntityPropertySelect from './EntityPropertySelect';
import { FilterModelEntry } from '../../../../shared/filter';
import {
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
} from '../../../../shared/queries';

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
      minWidth: 300,
    },
  })
);

const EntityFilterDialog = (props: {
  filterOpen: boolean;
  handleCloseFilter: () => void;
  filterModelEntries: FilterModelEntry[];
  setFilterQuery: (condition: MatchAllCondition | null) => void; // TODO: Please rename me!
}): JSX.Element => {
  const classes = useStyles();

  const { filterOpen, handleCloseFilter, filterModelEntries, setFilterQuery } =
    props;

  // the filtered FilterModelEntries filled from the children EntityPropertySelects
  const filteredFilterModelEntries: FilterModelEntry[] = [];
  const setFilteredFilterModelEntries: React.Dispatch<
    React.SetStateAction<FilterModelEntry>
  >[] = [];
  filterModelEntries.forEach((type) => {
    const [filteredFilterModelEntry, setFilteredFilterModelEntry] =
      useState<FilterModelEntry>({
        key: type.key,
        values: [],
      });
    filteredFilterModelEntries.push(filteredFilterModelEntry);
    setFilteredFilterModelEntries.push(setFilteredFilterModelEntry);
  });

  const entitySelects: JSX.Element[] = [];
  filterModelEntries.forEach((type, index) => {
    entitySelects.push(
      <EntityPropertySelect
        entityType={type}
        filterModelEntry={filteredFilterModelEntries[index]}
        setFilterModelEntry={setFilteredFilterModelEntries[index]}
      />
    );
  });

  const handleApplyFilter = () => {
    const anyFilterConditions: MatchAnyCondition[] = [];

    for (const entry of filteredFilterModelEntries) {
      const propertyFilterConditions: MatchPropertyCondition[] = [];

      for (const value of entry.values) {
        propertyFilterConditions.push(MatchPropertyCondition(entry.key, value));
      }

      if (propertyFilterConditions.length > 0) {
        anyFilterConditions.push(
          MatchAnyCondition(...propertyFilterConditions)
        );
      }
    }

    if (anyFilterConditions.length > 0) {
      setFilterQuery(MatchAllCondition(...anyFilterConditions));
    } else {
      setFilterQuery(null);
    }
    handleCloseFilter();
  };

  return (
    <div>
      <Dialog open={filterOpen} onClose={handleCloseFilter} scroll="paper">
        <form className={classes.form}>
          <FormControl className={classes.dialog}>
            <DialogTitle>Filter Entity</DialogTitle>
            <DialogContent>{entitySelects}</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFilter} color="primary">
                Cancel
              </Button>
              <Button onClick={handleApplyFilter} color="primary">
                Apply Filter
              </Button>
            </DialogActions>
          </FormControl>
        </form>
      </Dialog>
    </div>
  );
};

export default EntityFilterDialog;
