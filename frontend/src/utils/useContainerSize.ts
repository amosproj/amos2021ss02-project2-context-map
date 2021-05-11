import React, { useLayoutEffect, useState } from 'react';
import nop from './nop';

export interface ContainerSize {
  width: number;
  height: number;
}

/**
 * A React hook that returns the size of the container specified by the React ref.
 * @param ref A React ref that represents a reference of the container to measure.
 * @returns An object of type {@link ContainerSize} that contains the container size.
 */
export function useContainerSize(
  ref: React.RefObject<HTMLElement>
): ContainerSize {
  // This state holds the current size of the container.
  const [size, setSize] = useState({ width: 0, height: 0 });

  // eslint-disable-next-line prefer-const
  let [resizeObserver, setResizeObserver] =
    useState<ResizeObserver | null>(null);

  // Using the layout effect here, to get a chance of synchronously getting notified
  // of changes to the DOM, so we can perform our measure before a user is able to
  // see the DOM changes being applied.
  useLayoutEffect(() => {
    // The DOM is changed here, so we can read the element from the ref.
    const element = ref.current;

    // If the ref points to no element, just do nothing.
    if (!element) {
      return nop;
    }

    function updateSize() {
      if (element) {
        // Update the size, which is a react-state. This forces the component to re-render itself.
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
      }
    }

    function resize() {
      updateSize();
    }

    // The general idea is to attach a resize observer to the element, that fires a callback,
    // whenever it gets resized, so we can update the size.

    resizeObserver = new ResizeObserver(resize);
    setResizeObserver(resizeObserver);
    resizeObserver.observe(element);
    updateSize();
    return () => resizeObserver?.disconnect();
  }, []);

  return size;
}
