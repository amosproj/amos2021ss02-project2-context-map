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
      {
        text: 'I want to recognize communities in the social network of my company',
        weight: {
          C: 1,
          BC: 0.8,
          H: 0.2,
          R: 0.2,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to determine superiors and subordinated in a management system',
        weight: {
          C: 0,
          BC: 0,
          H: 1,
          R: 0.9,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to display the hierarchy of items according to their value',
        weight: {
          C: 0.3,
          BC: 0,
          H: 0.7,
          R: 0.6,
          SP: 0,
          L: 0.7,
          P: 0,
        },
      },
      {
        text: 'I want to see how brands are hierarchically connected',
        weight: {
          C: 0,
          BC: 0,
          H: 1,
          R: 0.8,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to see sectors but also the hierarchy within',
        weight: {
          C: 0,
          BC: 0,
          H: 0.7,
          R: 1,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to see the hierarchies of each component of a product',
        weight: {
          C: 0,
          BC: 0,
          H: 0.8,
          R: 1,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to see the structure of a complex product/service with plenty of subcomponents',
        weight: {
          C: 0.6,
          BC: 0,
          H: 0.6,
          R: 0.7,
          SP: 0,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to see how I am connected to Person XY from another department',
        weight: {
          C: 0.4,
          BC: 0.3,
          H: 0.3,
          R: 0.2,
          SP: 1,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to see how document A relates to document B',
        weight: {
          C: 0.4,
          BC: 0.3,
          H: 0.2,
          R: 0.1,
          SP: 1,
          L: 0,
          P: 0,
        },
      },
      {
        text: 'I want to know highly socialised people in the internal network of my company',
        weight: {
          C: 0.5,
          BC: 1,
          H: 0,
          R: 0,
          SP: 0,
          L: 0.2,
          P: 0,
        },
      },
      {
        text: 'I want to know most necessary documents in my workflow',
        weight: {
          C: 0,
          BC: 1,
          H: 0,
          R: 0,
          SP: 0,
          L: 0,
          P: 0.2,
        },
      },
      {
        text: 'I want to see the most connected project of my company',
        weight: {
          C: 0.3,
          BC: 1,
          H: 0.3,
          R: 0.5,
          SP: 0,
          L: 0.1,
          P: 0,
        },
      },
      {
        text: 'I want to see all documents needed for my workflow',
        weight: {
          C: 0.6,
          BC: 0,
          H: 0,
          R: 0,
          SP: 0,
          L: 1,
          P: 0,
        },
      },
      {
        text: 'I want to see all employees of deparment X',
        weight: {
          C: 0.4,
          BC: 0,
          H: 0.8,
          R: 0.6,
          SP: 0,
          L: 1,
          P: 0,
        },
      },
      {
        text: 'I want to see statistical demographics of my employees',
        weight: {
          C: 0,
          BC: 0,
          H: 0,
          R: 0,
          SP: 0,
          L: 0.5,
          P: 0.8,
        },
      },
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
      {
        text: 'Level/ Top-Down',
        weight: { C: 0, BC: 0, H: 1, R: 0.8, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Parent-Child Relation',
        weight: { C: 0, BC: 0, H: 1, R: 1, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'I have a tree in mind',
        weight: { C: 0, BC: 0, H: 1, R: 0.2, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Minimize overlapping nodes',
        weight: { C: 0.3, BC: 0.3, H: 0, R: 0.5, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Hierarchy + Clustering',
        weight: { C: 0.5, BC: 0, H: 0.5, R: 1, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Spanning Radial trees',
        weight: { C: 0, BC: 0, H: 0, R: 1, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'A path from A to B',
        weight: { C: 0, BC: 0, H: 0.2, R: 0.2, SP: 1, L: 0, P: 0 },
      },
      {
        text: 'A roadmap',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0.8, L: 0, P: 0 },
      },
      {
        text: 'Heatmap',
        weight: { C: 0.7, BC: 0.7, H: 0, R: 0, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Center of connection',
        weight: { C: 0.7, BC: 1, H: 0.3, R: 0.4, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'A table of results',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0, L: 1, P: 0 },
      },
      {
        text: 'A pie chart',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0, L: 0, P: 1 },
      },
    ],
  },
  {
    text: 'What best describes your question? / What solution are you expecting?',
    answers: [
      {
        text: 'Automatic classification',
        weight: { C: 1, BC: 0.2, H: 0.2, R: 0.2, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Typological analysis',
        weight: { C: 1, BC: 0, H: 0.2, R: 0.2, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Horizontal hierarchical structures',
        weight: { C: 0, BC: 0, H: 1, R: 0, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Combine directed graph and tree structure',
        weight: { C: 0, BC: 0, H: 0.5, R: 1, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Edge bundling of similar routes for less clutter',
        weight: { C: 0, BC: 0, H: 0, R: 1, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Highlighting most used nodes',
        weight: { C: 0, BC: 1, H: 0, R: 0, SP: 0, L: 0, P: 0 },
      },
      {
        text: 'Shortest path',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 1, L: 0, P: 0 },
      },
      {
        text: 'List of results',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0, L: 1, P: 0 },
      },
    ],
  },
  {
    text: 'Which kind of data is interesting for you?',
    answers: [
      {
        text: 'Financial data',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0, L: 0.5, P: 0.3 },
      },
      {
        text: 'Personal data',
        weight: { C: 1, BC: 1, H: 1, R: 1, SP: 1, L: 0, P: 0 },
      },
      {
        text: 'Measuring data',
        weight: { C: 0.2, BC: 0, H: 0, R: 0, SP: 0.5, L: 1, P: 0 },
      },
      {
        text: 'Reference data',
        weight: { C: 0.5, BC: 1, H: 0.3, R: 0.3, SP: 1, L: 0, P: 0 },
      },
      {
        text: 'Customer data',
        weight: { C: 1, BC: 0.5, H: 0.2, R: 0.2, SP: 0.2, L: 0, P: 0.6 },
      },
      {
        text: 'Market data',
        weight: { C: 0.8, BC: 0.7, H: 0.5, R: 0.5, SP: 0, L: 0.6, P: 0.8 },
      },
      {
        text: 'Metrics',
        weight: { C: 0, BC: 0, H: 0, R: 0, SP: 0, L: 1, P: 1 },
      },
    ],
  },
];

export default explorationQuestions;
