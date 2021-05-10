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
  const [curr, setCurr] = useState<HTMLElement | null>(null);

  // eslint-disable-next-line prefer-const
  let [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(
    null
  );

  useLayoutEffect(() => {
    const element = ref.current;

    console.log(curr ? 'curr not null' : 'curr null');
    console.log(element ? 'new not null' : 'new null');
    console.log(curr === element ? 'new eq curr' : 'new not eq curr');

    setCurr(element);

    if (!element) {
      return nop;
    }

    function updateSize() {
      console.log('update size');
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
      }
    }

    function resize() {
      console.log('resize');
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
