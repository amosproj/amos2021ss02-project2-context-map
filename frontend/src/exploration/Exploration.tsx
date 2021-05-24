import React from 'react';
import { firstValueFrom, timer } from 'rxjs';
import { useLoading } from '../utils/loading';

/* eslint-disable no-console */

function Exploration(): JSX.Element {
  const loading = useLoading();
  const click = () => {
    // activate loading bar as long as the promise is active
    loading(
      // converts observable to promise
      firstValueFrom(
        // fires single event in 5000ms
        timer(5000)
      )
    ).then(() => console.log('Done'));
  };

  return (
    <>
      <h1>Exploration</h1>
      <p>TODO: Implement me, pls</p>
      <button onClick={click} type="button">
        Start a single 5 second timer
      </button>
    </>
  );
}

export default Exploration;

/* eslint-enable */
