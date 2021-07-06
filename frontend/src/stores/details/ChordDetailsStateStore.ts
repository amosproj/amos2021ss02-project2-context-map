import 'reflect-metadata';
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';
import { ChordDetailsState } from './ChordDetailsState';

@injectable()
export class ChordDetailsStateStore extends SimpleStore<ChordDetailsState> {
  protected getInitialValue(): ChordDetailsState {
    return { chordData: { matrix: [], names: [], colors: [] } };
  }

  public clear(): void {
    this.setState(this.getInitialValue());
  }

  public showDetails(chordData: ChordData, index: number): void {
    this.mergeState({ chordData, index });
  }
}

export default ChordDetailsStateStore;
