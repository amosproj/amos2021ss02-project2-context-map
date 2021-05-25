import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  CancellationToken,
  CancellationTokenSource,
} from '../../utils/CancellationToken';
import ErrorComponent, { ErrorType } from '../../errors/ErrorComponent';
import CancellationError from '../../utils/CancellationError';
import { HttpError, NetworkError } from '../../services/http';

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
 * A function that describe the render operation of fetched data to a view described via a {@link JSX.Element}.
 * The function receives the fetched data. And optional a function that can be invoked to update the data.
 */
type RenderFunction<T> = (t: T, update: () => void) => JSX.Element;

/**
 * A function that asynchronously performs the query operation and returns a promise describing the asynchronous operation.
 */
type QueryFunction<TArgs extends unknown[], TResult> = (
  ...args: [...TArgs, CancellationToken]
) => Promise<TResult>;

/**
 * Describes the options of a data fetch operation.
 */
export interface FetchDataOptions<TArgs extends unknown[], TData> {
  /**
   * The query function used to fetch the data asynchronously.
   */
  queryFn: QueryFunction<TArgs, TData>;

  /**
   * The default value of the data that will be rendered when no data is fetched (yet)
   * OR undefined if no default data shall be rendered.
   */
  defaultData?: TData;
}

/**
 * Fetches data asynchronously and displays them with the specified render function.
 * While the screen is loading a {@link JSX.Element}, showing a loading screen, is returned.
 * When an error occurs a {@link JSX.Element}, showing an error screen, is returned.
 * When the data to be fetched is undefined a {@link JSX.Element}, showing an error message, is returned.
 *
 * @param queryFn - The function that executed the query.
 * @param content - The function that renders the fetched data to a view described via a {@link JSX.Element}.
 * @param args - Arguments that are passed to {@link queryFn} when it is invoked.
 * @returns A view of the current state of the loading operation described via a {@link JSX.Element}.
 */
function fetchDataFromService<TArgs extends unknown[], TData>(
  queryFn: QueryFunction<TArgs, TData>,
  content: RenderFunction<TData>,
  ...args: TArgs
): JSX.Element;

/**
 * Fetches data asynchronously and displays them with the specified render function.
 * While the screen is loading a {@link JSX.Element}, showing a loading screen, is returned.
 * When an error occurs a {@link JSX.Element}, showing an error screen, is returned.
 * When the data to be fetched is undefined a {@link JSX.Element}, showing an error message, is returned.
 *
 * @param options - An instance of {@link FetchDataOptions<TArgs, TData>} that contain the options of the query operation.
 * @param content - The function that renders the fetched data to a view described via a {@link JSX.Element}.
 * @param args - Arguments that are passed to {@link queryFn} when it is invoked.
 * @returns A view of the current state of the loading operation described via a {@link JSX.Element}.
 */
function fetchDataFromService<TArgs extends unknown[], TData>(
  options: FetchDataOptions<TArgs, TData>,
  content: RenderFunction<TData>,
  ...args: TArgs
): JSX.Element;

function fetchDataFromService<TArgs extends unknown[], TData>(
  queryFnOrOptions:
    | QueryFunction<TArgs, TData>
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
  // TODO: This logic should not be here but in the ErrorComponent type
  //       See also: https://github.com/amosproj/amos-ss2021-project2-context-map/issues/144
  if (error) {
    return <ErrorComponent jsError={error} />;
  }

  // Display an error message if something went wrong. This should not happen normally.
  if (!data) {
    return <ErrorComponent />;
  }

  return renderContent(data);
}

export default fetchDataFromService;
