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
import EntityPropertySelect from './EntityPropertySelect';

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
    select: {
      width: 200,
    },
  })
);

const EntityFilterDialog = (props: {
  filterOpen: boolean;
  handleCloseFilter: () => void;
  entityTypes: string[];
}): JSX.Element => {
  const { filterOpen, handleCloseFilter, entityTypes } = props;

  const entitySelects: unknown[] = [];
  entityTypes.forEach((type) => {
    entitySelects.push(<EntityPropertySelect entityType={type} />);
  });

  const classes = useStyles();
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
              <Button onClick={handleCloseFilter} color="primary">
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
