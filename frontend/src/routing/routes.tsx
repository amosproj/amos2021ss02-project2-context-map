import React from 'react';
import Archetypes from '../archetypes/Archetypes';
import Data from '../data/Data';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Graph from '../visualization/Graph';
import Schema from '../visualization/Schema';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';
import { LoadingBoundary } from '../utils/loading';
import { LoadingBoundaryObservables } from '../utils/loading/observables';

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
        content: () => <Graph />,
      },
      {
        path: '/visualization/schema',
        label: 'Schema',
        content: () => <Schema />,
      },
    ],
  },
  Exploration: {
    path: '/exploration',
    label: 'Exploration',
    content: () => (
      <LoadingBoundary>
        <Exploration />
      </LoadingBoundary>
    ),
  },
  Data: {
    path: '/data',
    label: 'Data',
    content: () => (
      <LoadingBoundaryObservables>
        <Data />
      </LoadingBoundaryObservables>
    ),
  },
  Archetypes: {
    path: '/archetypes',
    label: 'Archetypes',
    content: () => <Archetypes />,
  },
};

export default routes;
