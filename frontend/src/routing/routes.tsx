import React from 'react';
import Data from '../data/Data';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';
import ChordPage from '../visualization/ChordPage';
import BetweennessPage from '../visualization/betweenness/BetweennessPage';
import RadialPage from '../visualization/radial/RadialPage';
import SchemaPage from '../visualization/SchemaPage';
import GraphEntityPage from '../visualization/GraphEntityPage';

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
        content: () => <GraphEntityPage />,
      },
      {
        path: '/visualization/hierarchical',
        label: 'Hierarchies',
        content: () => <GraphEntityPage layout="hierarchical" />,
      },
      {
        path: '/visualization/betweenness',
        label: 'Betweenness',
        content: () => <BetweennessPage />,
      },
      {
        path: '/visualization/radial',
        label: 'Radial',
        content: () => <RadialPage />,
      },
      {
        path: '/visualization/schema',
        label: 'Schema',
        content: () => <SchemaPage />,
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
