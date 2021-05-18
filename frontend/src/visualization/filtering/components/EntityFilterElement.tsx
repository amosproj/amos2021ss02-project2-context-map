import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import EntityFilterDialog from './dialog/EntityFilterDialog';

const useStyles = makeStyles({
  root: {
    maxWidth: 150,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ].join(','),
    '&:hover': {
      boxShadow: 'none',
    },
  },
});

const EntityFilterElement = (props: {
  backgroundColor: string;
  name: string;
  entityTypePropertyNames: string[];
}): JSX.Element => {
  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = useState('None');

  const { backgroundColor, name, entityTypePropertyNames } = props;
  const classes = useStyles();

  const handleOpenFilter = () => {
    setFilterOpen(true);
  };
  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  const handleAddEntity = () => {
    setBoxShadow(
      boxShadow === 'None' ? '0 0 0 0.2rem rgba(0,123,255,.5)' : 'None'
    );
  };

  return (
    <div>
      <Button
        style={{ backgroundColor, boxShadow }}
        variant="contained"
        color="primary"
        disableRipple
        className={classes.root}
      >
        {name}
      </Button>
      <IconButton component="span">
        <TuneIcon onClick={handleOpenFilter} />
      </IconButton>
      <IconButton component="span">
        <AddIcon onClick={handleAddEntity} />
      </IconButton>
      <EntityFilterDialog
        filterOpen={filterOpen}
        handleCloseFilter={handleCloseFilter}
        entityTypes={entityTypePropertyNames}
      />
    </div>
  );
};

export default EntityFilterElement;
