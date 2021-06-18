import SimpleStore from './SimpleStore';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../shared/schema';

export type SelectedSearchResult = {
  key?: string | number;
  content:
    | EdgeDescriptor
    | EdgeTypeDescriptor
    | NodeDescriptor
    | NodeTypeDescriptor
    | undefined;
};

/**
 * Contains the selected search result (if any).
 * It's the search result that was clicked on in the search bar.
 */
export default class SearchSelectionStore extends SimpleStore<SelectedSearchResult> {
  protected getInitialValue(): SelectedSearchResult {
    return { content: undefined };
  }
}
