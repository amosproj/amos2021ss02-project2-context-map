import React from 'react';
import { interval, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { useLoadingBarObservables } from '../utils/loading/observables';

/* eslint-disable no-console */

function Data(): JSX.Element {
  const click = () => {
    // fires event in 5000ms
    timer(5000)
      // activate loading bar as long as the observable is active
      .pipe(useLoadingBarObservables())
      .subscribe({
        // this is what happens when the observable outputs something
        next: () => console.log(`timer done`),
      });
  };

  const click2 = () => {
    click();
    // fires event every 500ms
    interval(500)
      .pipe(
        // just take 8 values from the observable (finishes in 500*8ms)
        take(8),
        // activate loading bar as long as the observable is active
        useLoadingBarObservables()
      )
      .subscribe({
        // this is what happens in each "round"
        next: () => console.log('interval fired'),
        // this is what happens when the interval is completely done. usually not interesting in our case
        complete: () => console.log('interval complete'),
      });
  };

  return (
    <>
      <h1>Data</h1>
      <p>TODO: Implement me, pls</p>
      <p>Open console!</p>
      <button onClick={click} type="button">
        Start a single 5 second timer
      </button>
      <br />
      <button onClick={click2} type="button">
        Start a 5 second timer and an interval that fires 8 times with a 500ms
        pause
      </button>
    </>
  );
}

export default Data;

/* eslint-enable */
