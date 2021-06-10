import { TestScheduler } from 'rxjs/testing';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';
import LoadingStore from '../../../src/stores/LoadingStore';
import withLoadingBar from '../../../src/utils/withLoadingBar';
import CancellationError from '../../../src/utils/CancellationError';

const testScheduler = () =>
  new TestScheduler((actual, expected) => {
    // asserting the two objects are equal - required
    // for TestScheduler assertions to work via your test framework
    // e.g. using chai.
    expect(actual).deep.equal(expected);
  });

context('withLoadingBar', () => {
  let loadingStore: LoadingStore;

  beforeEach(() => {
    loadingStore = new LoadingStore();
  });

  context('single loader', () => {
    it('should start loading after subscribe, not after observable creation', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, time } = helpers;

        const marbles = {
          // Source finishes after 4 ticks
          source: '               ----|',
          // When delay is finished, source starts
          delay: '          ------|',
          // Start with 0 active loaders, then expect one when source is subscribed to, then expect 0 when source is done
          expectedStore: '  0-----1---0',
        };

        // Arrange
        // Create dummy observable with these states
        const obs = cold(marbles.source);
        // Create actual observable that starts dummy observable after a delay
        const actual = timer(time(marbles.delay)).pipe(
          // Start obs with loading bar when timer is over
          switchMap(() => obs.pipe(withLoadingBar({ loadingStore })))
        );
        // Get actual store observable
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        // Act
        // Just start observable without tests
        expectObservable(actual);

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });

    it('should stop loading after error', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, time } = helpers;

        const marbles = {
          // Source throws error after 4 ticks
          source: '               ----#',
          // When delay is finished, source starts
          delay: '          ------|',
          // Start with 0 active loaders, then expect one when source is subscribed to, then expect 0 when source is done
          expectedStore: '  0-----1---0',
        };

        // Arrange
        // Create dummy observable with these states
        const obs = cold(marbles.source);
        const actual = timer(time(marbles.delay)).pipe(
          // Start obs with loading bar when timer is over
          switchMap(() => obs.pipe(withLoadingBar({ loadingStore })))
        );
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        // Act
        // Just start observable without tests
        expectObservable(actual);

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });

    it('should stop loading after error without throwing CancellationError', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable } = helpers;

        const marbles = {
          // Source throws error after 4 ticks
          source: '         ----#',
          expected: '       ----|',
          expectedStore: '  1---0',
        };

        // Arrange
        // Create dummy observable with these states
        const obs = cold(marbles.source);
        const actual = obs.pipe(
          // Maps error to Cancellation Error
          catchError(() => throwError(() => new CancellationError())),
          withLoadingBar({ loadingStore })
        );
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        // Act
        expectObservable(actual).toBe(marbles.expected);

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });

    it('should not be affected by emits', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, time } = helpers;

        const marbles = {
          source: '               -abc-d-e-f-|',
          delay: '          ------|',
          expectedStore: '  0-----1----------0',
        };

        // Arrange
        // Create dummy observable with these states
        const obs = cold(marbles.source);
        const actual = timer(time(marbles.delay)).pipe(
          // Start obs with loading bar when timer is over
          switchMap(() => obs.pipe(withLoadingBar({ loadingStore })))
        );
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        // Act
        // Just start observable without tests
        expectObservable(actual);

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });

    it('should remove loader after unsubscribe', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, expectSubscriptions } = helpers;

        // Scenario:
        // obs1 runs with loadingBar and unsubscribes eventually.
        // obs2 runs without loading bar und runs longer than obs1.
        // This is required since without obs2, source will stop it's execution when
        // obs1 unsubscribes.
        const marbles = {
          source: '         --abc-d---f-|',
          expected1: '      --abc-d--',
          sub1: '           ^-------!----',
          expected2: '      --abc-d---f- ',
          sub2: '           ^-----------!',
          expectedStore: '  1-------0----',
        };

        // Arrange
        // Create dummy observable
        const source = cold(marbles.source);
        const actual = source.pipe(withLoadingBar({ loadingStore }));
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        // Acts & Assert
        // Start short obs1 with loading bar
        expectObservable(actual, marbles.sub1).toBe(marbles.expected1);

        // Start longer obs2 without loading bar
        expectObservable(source, marbles.sub2).toBe(marbles.expected2);

        // Validate that the subscriptions are made correctly (it's a check
        // for the test than for the testing target).
        expectSubscriptions(source.subscriptions).toBe([
          marbles.sub1,
          marbles.sub2,
        ]);

        // Validate that the loading bar removes the loader when unsubscribed
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });
  });

  context('multiple loaders', () => {
    it('should be able to handle multiple loaders', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, time } = helpers;

        const marbles = {
          operations: [
            {
              source: '            ----|      ',
              delay: '       ------|          ',
            },
            {
              source: '             --------| ',
              delay: '       -------|         ',
            },
            {
              source: '              -----|   ',
              delay: '       --------|        ',
            },
          ],
          expectedStore: '   0-----123-2--1-0 ',
        };

        // Arrange store
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        for (const operation of marbles.operations) {
          // Arrange
          const obs = cold(operation.source);
          const actual = timer(time(operation.delay)).pipe(
            // eslint-disable-next-line no-loop-func
            switchMap(() => obs.pipe(withLoadingBar({ loadingStore })))
          );
          // Act (no need for assert here since only the loading store is tested)
          expectObservable(actual);
        }

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });

    it('should be able to handle multiple loaders with errors', () => {
      testScheduler().run((helpers) => {
        const { cold, expectObservable, time } = helpers;

        const marbles = {
          operations: [
            {
              source: '            ----#      ',
              delay: '       ------|          ',
            },
            {
              source: '             --------# ',
              delay: '       -------|         ',
            },
            {
              source: '              -----|   ',
              delay: '       --------|        ',
            },
          ],
          expectedStore: '   0-----123-2--1-0 ',
        };

        // Arrange store
        const actualStore = loadingStore.getNumActiveLoaders().pipe(
          // Map incoming numbers to strings since marbles represent strings
          map((x) => x.toString())
        );

        for (const operation of marbles.operations) {
          // Arrange
          const obs = cold(operation.source);
          const actual = timer(time(operation.delay)).pipe(
            // eslint-disable-next-line no-loop-func
            switchMap(() => obs.pipe(withLoadingBar({ loadingStore })))
          );
          // Act (no need for assert here since only the loading store is tested)
          expectObservable(actual);
        }

        // Assert
        expectObservable(actualStore).toBe(marbles.expectedStore);
      });
    });
  });
});
