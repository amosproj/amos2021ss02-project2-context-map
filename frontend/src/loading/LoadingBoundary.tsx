import React, { useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { tap } from 'rxjs/operators';
import useService from '../dependency-injection/useService';
import LoadingStore from '../stores/LoadingStore';
import useObservable from '../utils/useObservable';

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
    backdropCancel: {
      marginTop: theme.spacing(3),
    },
    contentContainer: {
      padding: theme.spacing(3),
    },
  })
);

/**
 * Shows loading icon if an observable is running. These observables can be
 * registered using the pipe withLoadingBar
 */
export default function LoadingBoundary({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // is true if it should show the backdrop
  const [loading, setLoading] = useState<boolean>(false);
  const loadingStore = useService(LoadingStore);

  useObservable(
    loadingStore
      .getNumActiveLoaders()
      .pipe(tap((numActive) => setLoading(numActive > 0)))
  );

  const cancel = () => {
    loadingStore.deleteAllLoaders();
  };
  const classes = useStyles();
  return (
    <>
      <Backdrop open={loading} className={classes.backdrop}>
        <div className={classes.backdropContent}>
          <CircularProgress color="inherit" />
          <Button
            variant="outlined"
            color="default"
            onClick={cancel}
            className={classes.backdropCancel}
          >
            <CloseIcon />
            Cancel
          </Button>
        </div>
      </Backdrop>
      {children}
    </>
  );
}
