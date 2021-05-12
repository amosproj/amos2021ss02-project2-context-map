import React, { useLayoutEffect, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

export interface ContainerSize {
  width: number;
  height: number;
}

/**
 * A React hook that returns the size of the container specified by the React ref.
 * @param ref A React ref that represents a reference of the container to measure.
 * @returns An object of type {@link ContainerSize} that contains the container size.
 */
export function useSize(ref: React.RefObject<HTMLElement>): ContainerSize {
  // This state holds the current size of the container.
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;

    if (element) {
      setSize(element.getBoundingClientRect());
    }
  }, [ref]);

  useResizeObserver(ref, (entry) => setSize(entry.contentRect));

  return size;
}
