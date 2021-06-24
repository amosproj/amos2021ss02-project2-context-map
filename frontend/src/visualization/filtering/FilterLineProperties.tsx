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
import { FilterModelEntry } from '../../shared/filter';
import FilterLineProperty from './FilterLineProperty';
import useService from '../../dependency-injection/useService';
import FilterQueryStore from '../../stores/FilterQueryStore';
import FilterStateStore from '../../stores/filterState/FilterStateStore';

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

/**
 * View where properties of the corresponding EntityType, specified in {@link FilterLine},
 * can be selected. A selection is made in a {@link FilterLineProperty}.
 */
const FilterLineProperties = (props: {
  filterOpen: boolean;
  handleCloseFilter: () => void;
  filterModelEntries: FilterModelEntry[];
  filterLineType: string;
  entity: 'node' | 'edge';
}): JSX.Element => {
  const classes = useStyles();

  const [applyFilter, setApplyFilter] = useState(false);

  const filterQueryStore = useService<FilterQueryStore>(FilterQueryStore);
  const filterStateStore = useService<FilterStateStore>(FilterStateStore);

  const {
    filterOpen,
    handleCloseFilter,
    filterModelEntries,
    filterLineType,
    entity,
  } = props;

  const entitySelects = filterModelEntries.map((entry) => (
    <FilterLineProperty
      filterModelEntry={entry}
      filterLineType={filterLineType}
      entity={entity}
      applyFilter={applyFilter}
      setApplyFilter={setApplyFilter}
    />
  ));

  const handleApplyFilter = () => {
    setApplyFilter(true);
    filterStateStore.setFilterLineActive(filterLineType, entity);
    filterQueryStore.update();

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

export default FilterLineProperties;
