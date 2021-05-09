import React from 'react';
import Archetypes from '../archetypes/Archetypes';
import Data from '../data/Data';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Graph from '../visualization/Graph';
import Schema from '../visualization/Schema';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';

const routes: RouteDefinition[] = [
  {
    path: '/home',
    label: 'Home',
    content: () => <Home />,
  },
  {
    path: '/visualization',
    label: 'Visualization',
    exact: true,
    content: () => <Visualization />,
    tabs: [
      {
        path: '/visualization/graph',
        label: 'Graph',
        content: () => <Graph />,
      },
      {
        path: '/visualization/schema',
        label: 'Schema',
        content: () => <Schema />,
      },
    ],
  },
  {
    path: '/exploration',
    label: 'Exploration',
    content: () => <Exploration />,
  },
  {
    path: '/data',
    label: 'Data',
    content: () => <Data />,
  },
  {
    path: '/archetypes',
    label: 'Archetypes',
    content: () => <Archetypes />,
  },
];

export default routes;
