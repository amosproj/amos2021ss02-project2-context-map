import React from 'react';
import Archetypes from '../archetypes/Archetypes';
import Data from '../data/Data';
import ErrorBoundary from '../errors/ErrorBoundary';
import Exploration from '../exploration/Exploration';
import Home from '../home/Home';
import Graph from '../visualization/Graph';
import Schema from '../visualization/Schema';
import Visualization from '../visualization/Visualization';
import RouteDefinition from './RouteDefinition';

const routes: Record<string, RouteDefinition> = {
  Home: {
    path: '/home',
    label: 'Home',
    content: () => (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    ),
  },
  Visualization: {
    path: '/visualization',
    label: 'Visualization',
    exact: true,
    content: () => (
      <ErrorBoundary>
        <Visualization />
      </ErrorBoundary>
    ),
    tabs: [
      {
        path: '/visualization/graph',
        label: 'Graph',
        content: () => (
          <ErrorBoundary>
            <Graph />
          </ErrorBoundary>
        ),
      },
      {
        path: '/visualization/schema',
        label: 'Schema',
        content: () => (
          <ErrorBoundary>
            <Schema />
          </ErrorBoundary>
        ),
      },
      {
        path: '/visualization/hierarchical',
        label: 'Hierarchies',
        content: () => (
          <ErrorBoundary>
            <Schema />
          </ErrorBoundary>
        ),
      },
    ],
  },
  Exploration: {
    path: '/exploration',
    label: 'Exploration',
    content: () => (
      <ErrorBoundary>
        <Exploration />
      </ErrorBoundary>
    ),
  },
  Data: {
    path: '/data',
    label: 'Data',
    content: () => (
      <ErrorBoundary>
        <Data />
      </ErrorBoundary>
    ),
  },
  Archetypes: {
    path: '/archetypes',
    label: 'Archetypes',
    content: () => (
      <ErrorBoundary>
        <Archetypes />
      </ErrorBoundary>
    ),
  },
};

export default routes;
