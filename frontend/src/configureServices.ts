import { Container } from 'inversify';
import HttpService from './services/http';
import { QueryService, QueryServiceImpl } from './services/query';
import {
  RandomNumberGenerator,
  RandomNumberGeneratorImpl,
} from './services/random-number';
import { SearchService, SearchServiceImpl } from './services/search';
import { FilterService, FilterServiceImpl } from './services/filter';
import { SchemaService, SchemaServiceImpl } from './services/schema';
import QueryResultStore from './stores/QueryResultStore';
import FilterQueryStore from './stores/FilterQueryStore';
import ErrorStore from './stores/ErrorStore';
import LoadingStore from './stores/LoadingStore';
import NodeColorStore from './stores/colors/NodeColorStore';
import EdgeColorStore from './stores/colors/EdgeColorStore';
import FilterStateStore from './stores/FilterStateStore';

/**
 * Configures all services in the frontend app.
 * @param container The dependency injection container.
 * @description See https://inversify.io/ for details of the configuration or https://github.com/inversify/InversifyJS/blob/master/wiki/classes_as_id.md for a starting point.
 */
export default function configureServices(container: Container): void {
  // A service used for testing the DI setup
  container.bind(RandomNumberGenerator).to(RandomNumberGeneratorImpl);

  container.bind(HttpService).toConstantValue(
    new HttpService({
      baseUri: process.env.REACT_APP_QUERY_SERVICE_BASE_URI,
    })
  );

  container.bind(QueryService).to(QueryServiceImpl);
  container.bind(SearchService).to(SearchServiceImpl);
  container.bind(SchemaService).to(SchemaServiceImpl);
  container.bind(FilterService).to(FilterServiceImpl);

  // stores: use inSingletonScope so only one instance of each store exists
  container.bind(ErrorStore).to(ErrorStore).inSingletonScope();
  container.bind(LoadingStore).to(LoadingStore).inSingletonScope();
  container.bind(FilterStateStore).to(FilterStateStore).inSingletonScope();
  container.bind(FilterQueryStore).to(FilterQueryStore).inSingletonScope();
  container.bind(QueryResultStore).to(QueryResultStore).inSingletonScope();
  container.bind(NodeColorStore).to(NodeColorStore).inSingletonScope();
  container.bind(EdgeColorStore).to(EdgeColorStore).inSingletonScope();
}
