import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useRef, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../../utils/CancellationToken';

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

type RenderFunction<T> = (t: T, update: () => void) => JSX.Element;

type QueryFunction<
  TArgs extends [...Array<unknown>, CancellationToken],
  TResult
> = (...args: TArgs) => Promise<TResult>;

export interface FetchDataOptions<TArgs extends Array<unknown>, TData> {
  queryFn: QueryFunction<[...TArgs, CancellationToken], TData>;
  defaultData?: TData;
}

/**
 * Fetches data from service using {@link useAsync} with {@link promiseFn} executeQuery.
 * If the screen is still loading a {@link JSX.Element}, showing a loading screen, is returned.
 * if an error occurs a {@link JSX.Element}, showing an error screen, is returned.
 * If the data to be fetched is undefined a {@link JSX.Element}, showing an error message, is returned.
 *
 * @param queryFn - the query the service executes
 * @param service - the service that executes the query
 * @param arg - optional, additional argument given to {@link useAsync}
 * @returns if one of the above cases occured, the corresponding {@link JSX.Element}, otherwise the data to be fetched
 */
function fetchDataFromService<TArgs extends Array<unknown>, TData>(
  queryFn: QueryFunction<[...TArgs, CancellationToken], TData>,
  content: RenderFunction<TData>,
  ...args: TArgs
): JSX.Element;

function fetchDataFromService<TArgs extends Array<unknown>, TData>(
  options: FetchDataOptions<TArgs, TData>,
  content: RenderFunction<TData>,
  ...args: TArgs
): JSX.Element;

function fetchDataFromService<TArgs extends Array<unknown>, TData>(
  queryFnOrOptions:
    | QueryFunction<[...TArgs, CancellationToken], TData>
    | FetchDataOptions<TArgs, TData>,
  content: RenderFunction<TData>,
  ...args: TArgs
): JSX.Element {
  const queryFn =
    typeof queryFnOrOptions === 'function'
      ? queryFnOrOptions
      : queryFnOrOptions.queryFn;

  const defaultData =
    typeof queryFnOrOptions === 'function'
      ? undefined
      : queryFnOrOptions.defaultData;

  const classes = useStyles();

  // The component state that contains the cancellation token source used to cancel the query operation.
  const [loadingCancellationSource] = React.useState(
    new CancellationTokenSource()
  );

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  const lastUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const argsWithCancellation = [...args, loadingCancellationSource.token] as [
      ...TArgs,
      CancellationToken
    ];
    setIsLoading(true);
    queryFn(...argsWithCancellation)
      .then((result) => {
        if (mounted) {
          lastUpdateRef.current = Date.now();
          setData(result);
          setIsLoading(false);
          setNeedsUpdate(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
          setNeedsUpdate(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [needsUpdate]);

  // A function that must be here (unless you want React to explode) that cancels the query operation.
  const cancelLoading = () => {
    loadingCancellationSource.cancel();
  };

  const renderBackdrop = (): JSX.Element => (
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
  );

  const renderContent = (d: TData): JSX.Element =>
    content(d, () => {
      setNeedsUpdate(true);
    });

  // Display a waiting screen with a cancel options, while the query is in progress.
  if (isLoading) {
    const dataOrDefault = data ?? defaultData;

    if (dataOrDefault) {
      return (
        <>
          {renderBackdrop()}
          {renderContent(dataOrDefault)}
        </>
      );
    }

    return renderBackdrop();
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

  return renderContent(data);
}

export default fetchDataFromService;
