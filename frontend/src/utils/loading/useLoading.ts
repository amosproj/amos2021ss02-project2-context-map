import { loadingSubject } from './LoadingBoundary';

export default function useLoading() {
  return <T>(promise: Promise<T>): Promise<T> => {
    loadingSubject.next(true);
    return promise.then(
      (next) => {
        loadingSubject.next(false);
        return next;
      },
      (error) => {
        loadingSubject.next(false);
        throw error;
      }
    );
  };
}
