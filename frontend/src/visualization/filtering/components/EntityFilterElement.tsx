import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import { AsyncProps, useAsync } from 'react-async';
import CloseIcon from '@material-ui/icons/Close';
import EntityFilterDialog from './dialog/EntityFilterDialog';
import { NodeTypeFilterModel } from '../../../shared/filter';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../../../utils/CancellationToken';
import useService from '../../../dependency-injection/useService';
import { FilterService } from '../../../services/filter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    backdropContent: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    backdropCancel: {
      marginTop: theme.spacing(3),
    },
    contentContainer: {
      padding: theme.spacing(3),
    },
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
  })
);

function fetchNodeTypeFilterModel(
  asyncProps: AsyncProps<NodeTypeFilterModel>
): Promise<NodeTypeFilterModel> {
  const thisFilterService = asyncProps.filterService as FilterService;
  const cancellation = asyncProps.cancellation as CancellationToken;
  return thisFilterService.getNodeTypeFilterModel('Person', cancellation);
}

const EntityFilterElement = (props: {
  backgroundColor: string;
  name: string;
}): JSX.Element => {
  const classes = useStyles();

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = useState('None');

  const { backgroundColor, name } = props;

  // The component state that contains the cancellation token source used to cancel the query operation.
  const [loadingCancellationSource] = React.useState(
    new CancellationTokenSource()
  );

  const filterService = useService(FilterService, null);
  // A React ref to the container that is used to measure the available space for the graph.
  const sizeMeasureContainerRef = useRef<HTMLDivElement>(null);

  // The state, as returned by react-async. Data are the node-types, when available.
  const { data, error, isLoading } = useAsync({
    promiseFn: fetchNodeTypeFilterModel,
    filterService,
    cancellation: loadingCancellationSource.token,
  });

  // Display the raw error message if an error occurred.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (error) {
    return <div>Something went wrong: {error?.message}</div>;
  }
  // Display an error message if something went wrong. This should not happen normally.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (!data) {
    return <div>Something went wrong</div>;
  }

  const entityTypePropertyNames = data.properties;

  // A function that must be here (unless you want React to explode) that cancels the query operation.
  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  // Display a waiting screen with a cancel options, while the query is in progress.
  if (isLoading) {
    return (
      <>
        <div
          className={classes.sizeMeasureContainer}
          ref={sizeMeasureContainerRef}
        />
        <Backdrop className={classes.backdrop} open>
          <div className={classes.backdropContent}>
            <CircularProgress color="inherit" />
            <Button
              variant="outlined"
              color="default"
              onClick={cancelLoading}
              className={classes.backdropCancel}
            >
              <CloseIcon />
              Cancel
            </Button>
          </div>
        </Backdrop>
      </>
    );
  }

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
