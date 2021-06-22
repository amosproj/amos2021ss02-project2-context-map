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
}
