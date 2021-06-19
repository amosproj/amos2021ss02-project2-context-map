import SimpleStore from './SimpleStore';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../shared/schema';

export type SelectedSearchResult =
  | EdgeDescriptor
  | EdgeTypeDescriptor
  | NodeDescriptor
  | NodeTypeDescriptor
  | undefined;

export const isEdgeDescriptor = (
  e: SelectedSearchResult
): e is EdgeDescriptor => (e === undefined ? false : 'type' in e);

export const isNodeDescriptor = (
  e: SelectedSearchResult
): e is NodeDescriptor => (e === undefined ? false : 'types' in e);

export const isEdgeTypeDescriptor = (
  e: SelectedSearchResult
): e is EdgeTypeDescriptor => (e === undefined ? false : 'edge' in e);

export const isNodeTypeDescriptor = (
  e: SelectedSearchResult
): e is NodeTypeDescriptor => (e === undefined ? false : 'node' in e);

/**
 * Contains the selected search result (if any).
 * It's the search result that was clicked on in the search bar.
 */
export default class SearchSelectionStore extends SimpleStore<SelectedSearchResult> {
  protected getInitialValue(): SelectedSearchResult {
    return undefined;
  }
}
