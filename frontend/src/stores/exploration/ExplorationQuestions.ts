import { ExplorationQuestion } from './interfaces/ExplorationQuestion';
import { DeepReadonly } from '../../utils/DeepReadonly';

/**
 * Contains all available question.
 * Must not be changed during runtime.
 */
const explorationQuestions: DeepReadonly<ExplorationQuestion[]> = [
  {
    text: 'Does one of these use cases match your question?',
    answers: [
      {
        text: 'I want to analyse multivariate data from surveys and test panels',
        weight: {
          C: 1,
          BC: 0.1,
          H: 0,
          R: 0,
          SP: 0,
          L: 0.4,
          P: 0.7,
        },
      },
      {
        text: 'I want to cluster consumers into market segments (to understand relationship between consumer groups)',
        weight: {
          C: 1,
          BC: 0,
          H: 0,
          R: 0,
          SP: 0,
          L: 0.1,
          P: 0.5,
        },
      },
      // TODO rest of question 1
    ],
  },
  {
    text: 'Which mental image best fits your question?',
    answers: [
      {
        text: 'Grouping',
        weight: {
          C: 1,
          BC: 0.3,
          H: 0.4,
          R: 0.4,
          SP: 0,
          L: 0,
          P: 0.5,
        },
      },
      {
        text: 'Network, Community',
        weight: {
          C: 0.8,
          BC: 0.5,
          H: 0.2,
          R: 0.2,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'Bottleneck, Stakeholder',
        weight: {
          C: 0.7,
          BC: 0.9,
          H: 0.3,
          R: 0.2,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      // TODO rest of question 2
    ],
  },
  // TODO rest of questions
];
export default explorationQuestions;
