import { BehaviorSubject, Observable } from 'rxjs';
import SimpleStore from './SimpleStore';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../shared/schema';

// enables discriminated union types https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
interface TypedEdgeDescriptor extends EdgeDescriptor {
  interfaceType: 'EdgeDescriptor';
}
interface TypedEdgeTypeDescriptor extends EdgeTypeDescriptor {
  interfaceType: 'EdgeTypeDescriptor';
}
interface TypedNodeDescriptor extends NodeDescriptor {
  interfaceType: 'NodeDescriptor';
}
interface TypedNodeTypeDescriptor extends NodeTypeDescriptor {
  interfaceType: 'NodeTypeDescriptor';
}

export type SelectedSearchResult =
  | TypedEdgeDescriptor
  | TypedEdgeTypeDescriptor
  | TypedNodeDescriptor
  | TypedNodeTypeDescriptor;

/**
 * Contains the selected search result (if any).
 * It's the search result that was clicked on in the search bar.
 */
export default class SearchSelectionStore extends SimpleStore<
  SelectedSearchResult | undefined
> {
  protected getInitialValue(): SelectedSearchResult | undefined {
    return undefined;
  }

  /**
   * Stores the number of active subscribers to this store (i.e. to the
   * Observable returned from {@link getState}).
   */
  private countSubscribers = new BehaviorSubject<number>(0);

  /**
   * @param [withoutSubscriberCount=false] if true, the subscriptions to the returned
   * observable does not count to the number of subscribers (see
   * {@link getCountSubscribers}). Use case: Stores.
   * @override
   * @example
   * // subscribe
   * const searchSelection = useObservable(
   *   searchSelectionStore.getState(),
   *   searchSelectionStore.getValue()
   * )
   *
   * // if search should be cleared when pages change:
   * // clear search selection on unmount
   * useEffect(() => {
   *   return () => searchSelectionStore.setState(undefined);
   * }, []);
   */
  getState(
    withoutSubscriberCount = false
  ): Observable<SelectedSearchResult | undefined> {
    if (withoutSubscriberCount) {
      return super.getState();
    }
    return super.getState().pipe(this.withSubscriberCount());
  }

  /**
   * Returns the number of active subscribers to this store (i.e. to the
   * Observable returned from {@link getState}).
   */
  getCountSubscribers(): Observable<number> {
    return this.countSubscribers.pipe();
  }

  /**
   * Observable operator that updates {@link countSubscribers} if the source
   * observable is subscribed to or unsubscribed.
   */
  private withSubscriberCount<T>() {
    return (source: Observable<T>): Observable<T> =>
      new Observable<T>((subscriber) => {
        const sub = source.subscribe(subscriber);
        this.countSubscribers.next(this.countSubscribers.getValue() + 1);

        return () => {
          sub.unsubscribe();
          this.countSubscribers.next(this.countSubscribers.getValue() - 1);
        };
      });
  }
}
