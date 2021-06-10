import { TestScheduler } from 'rxjs/testing';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import withErrorHandler from '../../../src/utils/withErrorHandler';
import ErrorStore from '../../../src/stores/ErrorStore';
import CancellationError from '../../../src/utils/CancellationError';

const testScheduler = () =>
  new TestScheduler((actual, expected) => {
    // asserting the two objects are equal - required
    // for TestScheduler assertions to work via your test framework
    // e.g. using chai.
    expect(actual).deep.equal(expected);
  });

context('withErrorHandler', () => {
  let errorStore: ErrorStore;

  beforeEach(() => {
    errorStore = new ErrorStore();
  });

  it('should catchError silently by default', () => {
    testScheduler().run((helpers) => {
      const { cold, expectObservable } = helpers;

      // Marbles: https://rxjs.dev/guide/testing/marble-testing
      // Simple explanation:
      // "-" = one step without any action
      // <char> = one emit
      // "#" = error
      const marbles = {
        // First emit a, then emit b after 2 steps of pause, then throw error after 2 more steps of pause
        source: '       -a--b--#',
        // Expect a, then b (no error!)
        expected: '     -a--b---',
        // Expect null (standard init), then e when source throws error
        expectedStore: 'n------e---',
      };

      // Arrange
      // Create dummy observable with these states
      const obs = cold(marbles.source);
      // Create actual observable with error handler
      const actual = obs.pipe(withErrorHandler({ errorStore }));
      // Get actual store observable
      const actualStore = errorStore.getState();

      // Act & Assert obs
      expectObservable(actual).toBe(marbles.expected);
      // Assert error state
      expectObservable(actualStore).toBe(marbles.expectedStore, {
        n: null,
        e: 'error',
      });
    });
  });

  it('should rethrow error if wanted', () => {
    testScheduler().run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        // First emit a, then emit b after 2 steps of pause, then throw error after 2 more steps of pause
        source: '       -a--b--#',
        // Expect a, then b, then an error
        expected: '     -a--b--#',
        // Expect null (standard init), then e when source throws error
        expectedStore: 'n------e---',
      };

      // Arrange
      const obs = cold(marbles.source);
      const actual = obs.pipe(withErrorHandler({ errorStore, rethrow: true }));
      const actualStore = errorStore.getState();

      // Act & Assert obs
      expectObservable(actual).toBe(marbles.expected);
      // Assert error state
      expectObservable(actualStore).toBe(marbles.expectedStore, {
        n: null,
        e: 'error',
      });
    });
  });

  it('should not change error state when CancellationError is thrown', () => {
    testScheduler().run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        // First emit a, then emit b after 2 steps of pause, then throw error after 2 more steps of pause
        source: '      -a--b--#',
        // Expect a, then b, then an error
        expected: '    -a--b---',
        // Expect null (standard init), then nothing anymore (although cancel error is thrown)
        actualStore: ' n-------',
      };

      // Arrange
      const obs = cold(marbles.source);
      const actual = obs.pipe(
        // Swap error to cancellation error
        catchError(() => throwError(() => new CancellationError())),
        withErrorHandler({ errorStore })
      );
      const actualStore = errorStore.getState();

      // Act & Assert obs
      expectObservable(actual).toBe(marbles.expected);
      // Assert error state
      expectObservable(actualStore).toBe(marbles.actualStore, {
        n: null,
        e: 'error',
      });
    });
  });
});
