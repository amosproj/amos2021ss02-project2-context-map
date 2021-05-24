import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

type LoadingKey = Subscription;

/**
 * Array of all currently active loading processes
 */
const loaderRefs: LoadingKey[] = [];

/**
 * Observable that outputs the current number of active loading processes
 */
const numActiveLoaders = new BehaviorSubject<number>(0);

/**
 * Adds an async process to the loading queue
 * @param key
 */
function addLoader(key: LoadingKey) {
  loaderRefs.push(key);
  numActiveLoaders.next(loaderRefs.length);
}

/**
 * Removes an finished (!) async process from the queue
 */
function removeLoader(key: LoadingKey) {
  const index = loaderRefs.indexOf(key, 0);
  if (index > -1) {
    loaderRefs.splice(index, 1);
    numActiveLoaders.next(loaderRefs.length);
    // console.log(key, loaderRefs);
  }
}

/**
 * Deletes all loaders from the queue and unsubscribes all of them
 */
function deleteAllLoaders() {
  for (const loaderRef of loaderRefs) {
    loaderRef.unsubscribe();
  }
  loaderRefs.splice(0, loaderRefs.length);
  numActiveLoaders.next(loaderRefs.length);
}

/**
 * Pipe for observables that activates a loading backdrop as long as the
 * observable is active
 */
export function useLoadingBar<T>() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      // console.log("created");
      const sub = source.subscribe({
        next(x: T) {
          // console.log("next");
          observer.next(x);
        },
        error(err: unknown) {
          // console.log("error");
          removeLoader(sub);
          observer.error(err);
        },
        complete() {
          // console.log("complete");
          removeLoader(sub);
          observer.complete();
        },
      });
      addLoader(sub);
      return sub;
    });
}

/**
 * Shows loading icon if an observable is running. These observables can be
 * registered using the pipe {@link useLoadingBar}
 */
export default function LoadingBoundary({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // is true if it should show the backdrop
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Listens on changes
    const sub = numActiveLoaders.subscribe((numActive) =>
      setLoading(numActive > 0)
    );
    // unsubscribes when unmounted => no memory leak
    return () => sub.unsubscribe();
  }, []);

  const cancel = () => {
    deleteAllLoaders();
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 1000 }}>
        <CircularProgress />
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </Backdrop>
      {children}
    </>
  );
}
