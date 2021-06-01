import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './App.scss';
import Layout, { RenderTab } from './Layout';
import ErrorComponent, { ErrorType } from './errors/ErrorComponent';
import routes from './routing/routes';
import ErrorBoundary from './errors/ErrorBoundary';
import LoadingBoundary from './loading/LoadingBoundary';
import useService from './dependency-injection/useService';
import ErrorStore from './stores/ErrorStore';

interface RenderRoute {
  path: string;
  exact: boolean;
  label: string;
  content: () => JSX.Element;
  tabs?: RenderTab[];
  tabIdx?: number;
}

function buildRenderRoutes(): RenderRoute[] {
  const result: RenderRoute[] = [];

  const routeKeys = Object.keys(routes);
  const routeValues = Object.values(routes);
  for (let routeIdx = 0; routeIdx < routeKeys.length; routeIdx += 1) {
    const route = routeValues[routeIdx];
    let renderTabs: RenderTab[] = [];

    if (route.tabs && route.tabs.length > 0) {
      renderTabs = route.tabs.map((tab) => ({
        path: tab.path,
        label: tab.label,
      }));

      renderTabs = [
        {
          path: route.path,
          label: route.label,
        },
        ...renderTabs,
      ];
    }

    result.push({
      path: route.path,
      exact: route.exact ?? false,
      label: route.label,
      content: route.content,
      tabs: renderTabs,
      tabIdx: 0,
    });

    if (route.tabs && route.tabs.length > 0) {
      for (let tabIdx = 0; tabIdx < route.tabs.length; tabIdx += 1) {
        const tab = route.tabs[tabIdx];
        result.push({
          path: tab.path,
          exact: tab.exact ?? false,
          label: tab.label,
          content: tab.content,
          tabs: renderTabs,
          tabIdx: tabIdx + 1,
        });
      }
    }
  }

  return result;
}

function App(): JSX.Element {
  const renderRoutes = buildRenderRoutes();
  const errorStore = useService(ErrorStore);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Layout>
            <Redirect to="/home" />
          </Layout>
        </Route>
        {renderRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact={route.exact}>
            <Layout tabs={route.tabs} label={route.label} tabIdx={route.tabIdx}>
              <ErrorBoundary errorStore={errorStore}>
                <LoadingBoundary>
                  <route.content />
                </LoadingBoundary>
              </ErrorBoundary>
            </Layout>
          </Route>
        ))}
        <Route path="*">
          <Layout>
            <ErrorComponent type={ErrorType.NotFound} />
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
