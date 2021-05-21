import { AsyncProps, useAsync } from 'react-async';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CancellationTokenSource } from '../../utils/CancellationToken';

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
    sizeMeasureContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  })
);

/**
 * Fetches data from service using {@link useAsync} with {@link promiseFn} executeQuery.
 * If the screen is still loading a {@link JSX.Element}, showing a loading screen, is returned.
 * if an error occurs a {@link JSX.Element}, showing an error screen, is returned.
 * If the data to be fetched is undefined a {@link JSX.Element}, showing an error message, is returned.
 *
 * @param executeQuery - the query the service executes
 * @param service - the service that executes the query
 * @returns if one of the above cases occured, the corresponding {@link JSX.Element}, otherwise the data to be fetched
 */
function fetchDataFromService<T>(
  executeQuery: (props: AsyncProps<T>) => Promise<T>,
  service: unknown
): JSX.Element | T {
  const classes = useStyles();

  // The component state that contains the cancellation token source used to cancel the query operation.
  const [loadingCancellationSource] = React.useState(
    new CancellationTokenSource()
  );

  // The state, as returned by react-async. Data is the query-result, when available.
  const { data, error, isLoading } = useAsync({
    promiseFn: executeQuery,
    service,
    cancellation: loadingCancellationSource.token,
  });

  // A function that must be here (unless you want React to explode) that cancels the query operation.
  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  // Display a waiting screen with a cancel options, while the query is in progress.
  if (isLoading) {
    return (
      <>
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

  // Display the raw error message if an error occurred.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (error) {
    return (
      <div className={classes.contentContainer}>
        Something went wrong: {error.message}
      </div>
    );
  }

  // Display an error message if something went wrong. This should not happen normally.
  // See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/77
  if (!data) {
    return <div className={classes.contentContainer}>Something went wrong</div>;
  }

  return data;
}

export default fetchDataFromService;
