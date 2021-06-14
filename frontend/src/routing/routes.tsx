import React from 'react';
import Archetypes from '../archetypes/Archetypes';
import Data from '../data/Data';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Schema from '../visualization/Schema';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';
import GraphPage from '../visualization/GraphPage';

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
        path: '/visualization/schema',
        label: 'Schema',
        content: () => <Schema />,
      },
      {
        path: '/visualization/hierarchical',
        label: 'Hierarchies',
        content: () => <GraphPage layout="hierarchical" />,
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
  Archetypes: {
    path: '/archetypes',
    label: 'Archetypes',
    content: () => <Archetypes />,
  },
};

export default routes;
