import React, { useLayoutEffect, useState } from 'react';
import nop from './nop';

export interface ContainerSize {
  width: number;
  height: number;
}

export function useContainerSize(
  ref: React.RefObject<HTMLElement>
): ContainerSize {
  const [size, setSize] = useState({ width: 0, height: 0 });

  // eslint-disable-next-line prefer-const
  let [resizeObserver, setResizeObserver] =
    useState<ResizeObserver | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return nop;
    }

    function updateSize() {
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
      }
    }

    function resize() {
      updateSize();
    }

    resizeObserver = new ResizeObserver(resize);
    setResizeObserver(resizeObserver);
    resizeObserver.observe(element);
    updateSize();
    return () => resizeObserver?.disconnect();
  }, []);

  return size;
}
