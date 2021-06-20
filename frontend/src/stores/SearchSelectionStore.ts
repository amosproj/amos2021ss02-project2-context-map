import SimpleStore from './SimpleStore';
import { EdgeDescriptor, NodeDescriptor } from '../shared/entities';
import { EdgeTypeDescriptor, NodeTypeDescriptor } from '../shared/schema';
import { EntityIdentifier } from '../search/Searchbar';

export type SelectedSearchResult =
  | ((
      | EdgeDescriptor
      | EdgeTypeDescriptor
      | NodeDescriptor
      | NodeTypeDescriptor
    ) & { kind: EntityIdentifier })
  | undefined;

export const isEdgeDescriptor = (
  e: SelectedSearchResult
): e is EdgeDescriptor & { kind: EntityIdentifier } =>
  e === undefined ? false : e.kind === 'Edges';

export const isNodeDescriptor = (
  e: SelectedSearchResult
): e is NodeDescriptor & { kind: EntityIdentifier } =>
  e === undefined ? false : e.kind === 'Nodes';

export const isEdgeTypeDescriptor = (e: SelectedSearchResult): boolean =>
  e === undefined ? false : e.kind === 'Edge Types';

export const isNodeTypeDescriptor = (e: SelectedSearchResult): boolean =>
  e === undefined ? false : e.kind === 'Node Types';

/**
 * Contains the selected search result (if any).
 * It's the search result that was clicked on in the search bar.
 */
export default class SearchSelectionStore extends SimpleStore<SelectedSearchResult> {
  protected getInitialValue(): SelectedSearchResult {
    return undefined;
  }
}
