import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SimpleStore from '../SimpleStore';
import { ExplorationAnswer } from './interfaces/ExplorationAnswer';
import { ExplorationWeight } from './interfaces/ExplorationWeight';
import calculateScore from './calculateScore';

/**
 * Store containing the current answers and the total score of these answers.
 */
export default class ExplorationStore extends SimpleStore<ExplorationAnswer[]> {
  protected getInitialValue(): ExplorationAnswer[] {
    return [];
  }

  /**
   * Use {@link addAnswer} or {@link removeAnswer}.
   * @deprecated
   */
  setState(newState: ExplorationAnswer[]): void {
    super.setState(newState);
  }

  /**
   * Use {@link addAnswer} or {@link removeAnswer}.
   * @deprecated
   */
  mergeState(newState: Partial<ExplorationAnswer[]>): void {
    super.mergeState(newState);
  }

  /**
   * Adds an answer to the state.
   */
  public addAnswer(answer: ExplorationAnswer): void {
    this.storeSubject.next(this.storeSubject.value.concat(answer));
  }

  /**
   * Removes an answer to the state.
   * The answer object must be exactly the same as the added one.
   */
  public removeAnswer(answer: ExplorationAnswer): void {
    this.storeSubject.next(this.storeSubject.value.filter((a) => a !== answer));
  }

  /**
   * Clears all answers
   */
  public reset(): void {
    this.storeSubject.next(this.getInitialValue());
  }

  /**
   * Returns an observable emitting the total score of the answers.
   */
  public getScoreState(): Observable<ExplorationWeight> {
    return this.getState().pipe(map((answers) => calculateScore(answers)));
  }

  /**
   * Returns the total score of the answers.
   */
  public getScoreValue(): ExplorationWeight {
    return calculateScore(this.getValue());
  }
}
