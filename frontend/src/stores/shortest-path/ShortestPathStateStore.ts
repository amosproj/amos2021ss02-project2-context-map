import SimpleStore from '../SimpleStore';
import { ShortestPathState } from './ShortestPathState';

/**
 * A state store that manages the shortest path state.
 */
export class ShortestPathStateStore extends SimpleStore<ShortestPathState> {
  protected getInitialValue(): ShortestPathState {
    return {
      startNode: null,
      endNode: null,
      ignoreEdgeDirections: false,
    };
  }

  /**
   * Resets the store to its initial state.
   */
  public reset(): void {
    this.setState(this.getInitialValue());
  }

  public setStartNode(startNode: number | null): void {
    this.mergeState({ startNode });
  }

  public setEndNode(endNode: number | null): void {
    this.mergeState({ endNode });
  }

  public setIgnoreEdgeDirections(ignoreEdgeDirections: boolean): void {
    this.mergeState({ ignoreEdgeDirections });
  }
}

export default ShortestPathStateStore;
