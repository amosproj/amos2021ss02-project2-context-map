import React, { useState } from 'react';
import { ListItem } from '@material-ui/core';

interface Props {
  /**
   * Elements to be shown.
   */
  list: JSX.Element[];
  /**
   * Maximum number of elements that are shown at start
   * @default 5
   */
  maxElements?: number;
  /**
   * Whether more list items can be shown after a button click.
   * @default true
   */
  showMore?: boolean;
}

function LimitListSizeComponent({
  list,
  maxElements,
  showMore,
}: Props): React.ReactElement<Props> {
  const [shownElements, setShownElements] = useState(maxElements);

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- is defined before called */
  const showShowMoreButton = () => showMore && shownElements! < list.length;

  return (
    <>
      {list.slice(0, shownElements)}
      {showShowMoreButton() ? (
        <ListItem
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ensured through default props */
          onClick={() => setShownElements(shownElements! + maxElements!)}
          key="showMoreButton"
          style={{
            cursor: 'pointer',
            justifyContent: 'flex-end',
          }}
        >
          Show More... ({shownElements} / {list.length})
        </ListItem>
      ) : null}
    </>
  );
}

LimitListSizeComponent.defaultProps = {
  maxElements: 5,
  showMore: true,
};

export default LimitListSizeComponent;
