import React from 'react';

/**
 * Returns an error handling function that can be used in promises.
 *
 * @example ```ts
const handleError = useDefaultErrorHandler();
service
  .makePromiseCall()
  .then(...) // no error happened
  .catch(handleError); // error is caught/handled by the error boundary
 * ```
 */
export default function useDefaultErrorHandler(): React.Dispatch<unknown> {
  const [error, setError] = React.useState<unknown>(null);
  if (error != null) throw error;
  return setError;
}
