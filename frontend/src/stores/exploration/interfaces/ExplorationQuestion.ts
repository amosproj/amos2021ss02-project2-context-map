import { ExplorationAnswer } from './ExplorationAnswer';

/**
 * Question containing several answers.
 */
export interface ExplorationQuestion {
  text: string;
  answers: ExplorationAnswer[];
}
