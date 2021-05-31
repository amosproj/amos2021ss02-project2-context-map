import { BehaviorSubject, Observable, Subscription } from 'rxjs';

type LoadingKey = Subscription;

/**
 * Stateful store that stores currently active observables
 */
export default class LoadingStore {
  /**
   * Array of all currently active loading processes
   */
  private loaderRefs: LoadingKey[] = [];

  /**
   * Observable that outputs the current number of active loading processes
   */
  private numActiveLoaders = new BehaviorSubject<number>(0);

  public getNumActiveLoaders(): Observable<number> {
    return this.numActiveLoaders.pipe();
  }

  /**
   * Adds an async process to the loading queue
   * @param key
   */
  public addLoader(key: LoadingKey): void {
    this.loaderRefs.push(key);
    this.numActiveLoaders.next(this.loaderRefs.length);
  }

  /**
   * Removes an finished (!) async process from the queue
   */
  public removeLoader(key: LoadingKey): void {
    const index = this.loaderRefs.indexOf(key, 0);
    if (index > -1) {
      this.loaderRefs.splice(index, 1);
      this.numActiveLoaders.next(this.loaderRefs.length);
    }
  }

  /**
   * Deletes all loaders from the queue and unsubscribes all of them
   */
  public deleteAllLoaders(): void {
    for (const loaderRef of this.loaderRefs) {
      loaderRef.unsubscribe();
    }
    this.loaderRefs.splice(0, this.loaderRefs.length);
    this.numActiveLoaders.next(this.loaderRefs.length);
  }
}
