import SimpleStore from '../SimpleStore';
import { ShortestPathState } from './ShortestPathState';

// eslint-disable-next-line import/prefer-default-export
export class ShortestPathStateStore extends SimpleStore<ShortestPathState> {
  protected getInitialValue(): ShortestPathState {
    return {
      startNode: null,
      endNode: null,
      ignoreEdgeDirections: false,
    };
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
