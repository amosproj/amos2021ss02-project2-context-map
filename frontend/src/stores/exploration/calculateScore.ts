import { ExplorationAnswer } from './interfaces/ExplorationAnswer';
import { ExplorationWeight } from './interfaces/ExplorationWeight';

/**
 * Calculates the total score for given exploration answers.
 */
export default function calculateScore(
  answers: ExplorationAnswer[]
): ExplorationWeight {
  const score: ExplorationWeight = {
    C: 0,
    BC: 0,
    H: 0,
    R: 0,
    SP: 0,
    L: 0,
    P: 0,
  };

  for (const answer of answers) {
    for (const key of Object.keys(score) as (keyof ExplorationWeight)[]) {
      score[key] += answer.weight[key];
    }
  }

  return score;
}
