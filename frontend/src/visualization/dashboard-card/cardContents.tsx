import { DeepReadonly } from '../../utils/DeepReadonly';

export interface CardPresentationContent {
  label: string;
  subLabel: string;
  description: string;
  icon: string;
  path: string;
}

const cardContents: ReadonlyArray<DeepReadonly<CardPresentationContent>> = [
  {
    label: 'Graph',
    subLabel: '2D network-based visualization',
    description: `Displays a clear relationship between nodes, 
      where the nodes also have a set tier or level that needs
      to be communicated.
      Takes multiple components into account, minimizes
      link crossing and makes efficient use of available
      screen space.`,
    icon: 'timeline',
    path: '/visualisation/graph',
  },
  {
    label: 'Schema',
    subLabel: 'Database insights',
    description: `Graph that represents the labels and
      relationship-types available in your database
      and how they are connected.`,
    icon: 'account_tree',
    path: '/visualisation/schema',
  },
  {
    label: 'Hierarchies',
    subLabel: '2D tree-based visualization',
    description: `Displays a clear relationship between nodes, 
      where the nodes also have a set tier or level that needs
      to be communicated.
      Takes multiple components into account, minimizes
      link crossing and makes efficient use of available
      screen space.`,
    icon: 'device_hub',
    path: '/visualisation/hierarchical',
  },
  {
    label: 'Chord Diagram',
    subLabel: 'Edge visualization',
    description: `Represents flows or connections between
    several entities. Each entity is represented by a fragment
    on the outer part of the circular layout. Then, arcs
    are drawn between the entities. The size of the arc is
    proportional to the importance of the flow.`,
    icon: 'donut_large',
    path: '/visualisation/chord',
  },
  {
    label: 'Betweenness',
    subLabel: 'Betweenness centrality',
    description: `Shows how much a given node is in-between others.
      This metric is measured with the number of
      shortest paths that pass through the target node.`,
    icon: 'bubble_chart',
    path: '/visualisation/betweenness',
  },
  {
    label: 'Radial',
    subLabel: '2D radial tree-based visualisation',
    description: `Radial layout arranges nodes in concentric
      circles around the original subject in a 
      radial tree. If we have hierarchical data, 
      each generation of node becomes a new 
      orbit extending outwards, showing a dependency chain.`,
    icon: 'track_changes',
    path: '/visualisation/radial',
  },
  {
    label: 'List',
    subLabel: 'Tabular visualisation',
    description: `An ordered visualization of nodes with
      respective descriptive data in tabular format.`,
    icon: 'view_list',
    path: '/data',
  },
];

export default cardContents;
