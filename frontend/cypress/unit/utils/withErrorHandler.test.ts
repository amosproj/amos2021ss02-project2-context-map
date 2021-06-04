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
        source: '      -a--b--#',
        // Expect a, then b (no error!)
        expected: '    -a--b---',
        // Expect null (standard init), then e when source throws error
        error: '       n------e---',
      };

      // Create dummy observable with these states
      const obs = cold(marbles.source);

      // Act & Assert obs
      expectObservable(obs.pipe(withErrorHandler({ errorStore }))).toBe(
        marbles.expected
      );
      // Assert error state
      expectObservable(errorStore.getState()).toBe(marbles.error, {
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
        source: '      -a--b--#',
        // Expect a, then b, then an error
        expected: '    -a--b--#',
        // Expect null (standard init), then e when source throws error
        error: '       n------e---',
      };

      // Create dummy observable with these states
      const obs = cold(marbles.source);

      // Act & Assert obs
      expectObservable(
        obs.pipe(withErrorHandler({ errorStore, rethrow: true }))
      ).toBe(marbles.expected);
      // Assert error state
      expectObservable(errorStore.getState()).toBe(marbles.error, {
        n: null,
        e: 'error',
      });
    });
  });

  it('should change error state when CancellationError is thrown', () => {
    testScheduler().run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        // First emit a, then emit b after 2 steps of pause, then throw error after 2 more steps of pause
        source: '      -a--b--#',
        // Expect a, then b, then an error
        expected: '    -a--b---',
        // Expect null (standard init), then nothing anymore (although cancel error is thrown)
        error: '       n-------',
      };

      // Create dummy observable with these states
      const obs = cold(marbles.source);

      // Act & Assert obs
      expectObservable(
        obs.pipe(
          // Swap error to cancellation error
          catchError(() => throwError(() => new CancellationError())),
          withErrorHandler({ errorStore })
        )
      ).toBe(marbles.expected);
      // Assert error state
      expectObservable(errorStore.getState()).toBe(marbles.error, {
        n: null,
        e: 'error',
      });
    });
  });
});
