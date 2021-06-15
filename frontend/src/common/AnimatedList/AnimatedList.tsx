import React, {
  Key,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { List } from '@material-ui/core';

/**
 * GUI element of the {@link AnimatedList}.
 */
export type AnimatedListElement = JSX.Element & {
  ref?: RefObject<HTMLElement>;
};

type Props = {
  /**
   * List-items; must have a key and a ref.
   */
  children: AnimatedListElement[];
  className?: string;
};

/**
 * Information about items in the AnimatedList-
 */
type ItemGuiInformation = {
  /**
   * Map with key = element key and value = bounding box.
   */
  boxes: Map<Key, DOMRect>;
  /**
   * Scroll position at the creation of objects of this type.
   */
  scrollY: number;
};

/**
 * Returns an {@link ItemGuiInformation} object for the given list items
 * @param children elements of the list
 */
function createItemGuiInformation(
  children: AnimatedListElement[]
): ItemGuiInformation {
  const boundingBoxes = new Map<Key, DOMRect>();

  React.Children.forEach(children, (child) => {
    const domNode = child.ref?.current;
    if (domNode && child.key != null) {
      boundingBoxes.set(child.key, domNode.getBoundingClientRect());
    }
  });

  return { boxes: boundingBoxes, scrollY: window.scrollY };
}

/**
 * Outputs the previous state from a variable of useState.
 * See https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
function usePrevious<T>(value: T) {
  const prevValue = useRef<T>();

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue.current;
}

/**
 * Returns a list that animated the reordering of its children.
 * @param children list-items
 * @param className react standard className attribute
 */
function AnimatedList({ children, className }: Props): JSX.Element {
  const [currBoundingBox, setCurrBoundingBox] = useState<ItemGuiInformation>({
    boxes: new Map(),
    scrollY: 0,
  });
  const prevBoundingBox = usePrevious(currBoundingBox);

  useLayoutEffect(() => {
    // When children change (e.g. reorder) => update item information
    setCurrBoundingBox(createItemGuiInformation(children));
  }, [children]);

  useEffect(() => {
    // if prevBoundingBox exists (=> no animation on first draw)
    if (prevBoundingBox && prevBoundingBox.boxes.size > 0) {
      // Check each child for changed position
      React.Children.forEach(children, (child) => {
        const domNode = child.ref?.current;
        // current/new bounding box for that child
        const currBox = currBoundingBox.boxes.get(child.key ?? '');
        // previous bounding box
        const prevBox = prevBoundingBox.boxes.get(child.key ?? '');

        // If box/box-position does not exists (e.g. on new item) => stop
        if (domNode == null || currBox === undefined || prevBox === undefined)
          return;

        // y-positions with cleaned scrolling (y independent of scrolling)
        // e.g. pos = 50, then 25px scrolling => normal y would be 75, cleaned is still 50
        const currScrollCleanedY = prevBox.top - currBoundingBox.scrollY;
        const prevScrollCleanedY = currBox.top - prevBoundingBox.scrollY;

        // difference of prev and curr position
        const deltaY = currScrollCleanedY - prevScrollCleanedY;

        // if difference is there => animate
        if (deltaY !== 0) {
          requestAnimationFrame(() => {
            // first, put item to its prev position
            domNode.style.transform = `translateY(${deltaY}px)`;
            domNode.style.transition = 'transform 0s';

            requestAnimationFrame(() => {
              // after the previous frame, remove the transition and play the animation
              domNode.style.transform = '';
              domNode.style.transition = 'transform 500ms';
            });
          });
        }
      });
    }
  }, [currBoundingBox, children]);

  return <List className={className}>{children}</List>;
}

AnimatedList.defaultProps = {
  className: '',
};

export default AnimatedList;
