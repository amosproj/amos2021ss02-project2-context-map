import 'reflect-metadata';
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';
import { ChordDetailsState } from './ChordDetailsState';

@injectable()
export class ChordDetailsStateStore extends SimpleStore<ChordDetailsState> {
  protected getInitialValue(): ChordDetailsState {
    return { type: null, matrix: null, index: null };
  }

  public clear(): void {
    this.setState(this.getInitialValue());
  }

  public showDetails(type: string, matrix: number[][], index: number): void {
    this.mergeState({ type, matrix, index });
  }
}

export default ChordDetailsStateStore;
