import React, {
  Key,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { List } from '@material-ui/core';

export type AnimatedListElement = JSX.Element & {
  ref?: RefObject<HTMLElement>;
};

type Props = {
  children: AnimatedListElement[];
  className?: string;
};

type BoundingBoxes = {
  boxes: Map<Key, DOMRect>;
  scrollY: number;
};

function getBoundingBoxes(children: AnimatedListElement[]): BoundingBoxes {
  const boundingBoxes = new Map<Key, DOMRect>();

  React.Children.forEach(children, (child) => {
    const domNode = child.ref?.current;
    if (domNode && child.key != null) {
      boundingBoxes.set(child.key, domNode.getBoundingClientRect());
    }
  });

  return { boxes: boundingBoxes, scrollY: window.scrollY };
}

function usePrevious<T>(value: T) {
  const prevChildrenRef = useRef<T>();

  useEffect(() => {
    prevChildrenRef.current = value;
  }, [value]);

  return prevChildrenRef.current;
}

function AnimatedList({ children, className }: Props): JSX.Element {
  const [boundingBox, setBoundingBox] = useState<BoundingBoxes>({
    boxes: new Map(),
    scrollY: 0,
  });
  const prevBoundingBox = usePrevious(boundingBox);

  useLayoutEffect(() => {
    setBoundingBox(getBoundingBoxes(children));
  }, [children]);

  useEffect(() => {
    if (prevBoundingBox && prevBoundingBox.boxes.size > 0) {
      React.Children.forEach(children, (child) => {
        const domNode = child.ref?.current;
        const prevBox = boundingBox.boxes.get(child.key ?? '');
        const currBox = prevBoundingBox.boxes.get(child.key ?? '');

        if (domNode == null || prevBox === undefined || currBox === undefined)
          return;

        const currScrollCleanedY = currBox.top - boundingBox.scrollY;
        const prevScrollCleanedY = prevBox.top - prevBoundingBox.scrollY;

        const positionChanged = currScrollCleanedY - prevScrollCleanedY;

        if (positionChanged) {
          requestAnimationFrame(() => {
            // Before the DOM paints, invert child to old position
            domNode.style.transform = `translateY(${positionChanged}px)`;
            domNode.style.transition = 'transform 0s';

            requestAnimationFrame(() => {
              // After the previous frame, remove
              // the transition to play the animation
              domNode.style.transform = '';
              domNode.style.transition = 'transform 500ms';
            });
          });
        }
      });
    }
  }, [boundingBox, children]);

  return <List className={className}>{children}</List>;
}

AnimatedList.defaultProps = {
  className: '',
};

export default AnimatedList;
