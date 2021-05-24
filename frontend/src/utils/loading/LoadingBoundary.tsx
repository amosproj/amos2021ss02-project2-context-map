import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { Subject } from 'rxjs';

export const loadingSubject = new Subject<boolean>();

export default function LoadingBoundary({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sub = loadingSubject.subscribe((next) => setLoading(next));
    return () => sub.unsubscribe();
  });

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
      {children}
    </>
  );
}
