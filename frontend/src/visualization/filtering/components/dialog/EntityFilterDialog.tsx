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
  FilterCondition,
  FilterQuery,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
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
  name: string;
  filterOpen: boolean;
  handleCloseFilter: () => void;
  entity: 'node' | 'edge';
  filterModelEntries: FilterModelEntry[];
  setFilterQuery: React.Dispatch<React.SetStateAction<FilterQuery>>;
}): JSX.Element => {
  const classes = useStyles();

  const {
    name,
    filterOpen,
    handleCloseFilter,
    filterModelEntries,
    entity,
    setFilterQuery,
  } = props;

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

  const entitySelects: unknown[] = [];
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
    // put filterQuery together
    const anyFilterConditions: FilterCondition[] = [];
    filteredFilterModelEntries.forEach((entry) => {
      const propertyFilterConditions: FilterCondition[] = [];
      entry.values.forEach((value) => {
        propertyFilterConditions.push(MatchPropertyCondition(entry.key, value));
      });
      anyFilterConditions.push(MatchAnyCondition(...propertyFilterConditions));
    });

    setFilterQuery({
      filters:
        entity === 'node'
          ? {
              nodes: MatchAllCondition(
                OfTypeCondition(name),
                MatchAnyCondition(...anyFilterConditions)
              ),
            }
          : {
              edges: MatchAllCondition(
                OfTypeCondition(name),
                MatchAnyCondition(...anyFilterConditions)
              ),
            },
    });
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
