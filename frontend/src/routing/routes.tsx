import React from 'react';
import Data from '../data/Data';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Schema from '../visualization/Schema';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';
import GraphPage from '../visualization/GraphPage';
import ChordPage from '../visualization/ChordPage';

const routes: Record<string, RouteDefinition> = {
  Home: {
    path: '/home',
    label: 'Home',
    content: () => <Home />,
  },
  Visualization: {
    path: '/visualization',
    label: 'Visualization',
    exact: true,
    content: () => <Visualization />,
    tabs: [
      {
        path: '/visualization/graph',
        label: 'Graph',
        content: () => <GraphPage />,
      },
      {
        path: '/visualization/hierarchical',
        label: 'Hierarchies',
        content: () => <GraphPage layout="hierarchical" />,
      },
      {
        path: '/visualization/betweenness',
        label: 'Betweenness',
        content: () => <GraphPage layout="hierarchical" />, // TODO #299: Add missing visualisation preview page
      },
      {
        path: '/visualization/radial',
        label: 'Radial',
        content: () => <GraphPage layout="hierarchical" />, // TODO #299: Add missing visualisation preview page
      },
      {
        path: '/visualization/schema',
        label: 'Schema',
        content: () => <Schema />,
      },
      {
        path: '/visualization/chord',
        label: 'Chord Diagram',
        content: () => <ChordPage />,
      },
    ],
  },
  Exploration: {
    path: '/exploration',
    label: 'Exploration',
    content: () => <Exploration />,
  },
  Data: {
    path: '/data',
    label: 'Data',
    content: () => <Data />,
  },
};

export default routes;
