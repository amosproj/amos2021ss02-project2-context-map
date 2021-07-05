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
import EntityStyleStore from './stores/colors/EntityStyleStore';
import FilterStateStore from './stores/filterState/FilterStateStore';
import ShortestPathService from './services/shortest-path/ShortestPathService';
import ShortestPathServiceImpl from './services/shortest-path/ShortestPathServiceImpl';
import { ShortestPathStateStore } from './stores/shortest-path/ShortestPathStateStore';
import ExplorationStore from './stores/exploration/ExplorationStore';
import SearchSelectionStore from './stores/SearchSelectionStore';
import SchemaStore from './stores/SchemaStore';
import { EntityDetailsStateStore } from './stores/details/EntityDetailsStateStore';

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

  // The auto-inject does not work. Thus, the required services is
  // injected manually
  container
    .bind(QueryService)
    .toDynamicValue(
      (context) => new QueryServiceImpl(context.container.get(HttpService))
    )
    .inSingletonScope();

  container.bind(SearchService).to(SearchServiceImpl).inSingletonScope();
  container.bind(SchemaService).to(SchemaServiceImpl).inSingletonScope();
  container
    .bind(FilterService)
    .toDynamicValue(
      (context) => new FilterServiceImpl(context.container.get(HttpService))
    )
    .inSingletonScope();

  container
    .bind(ShortestPathService)
    .to(ShortestPathServiceImpl)
    .inSingletonScope();

  // stores: use inSingletonScope so only one instance of each store exists
  container.bind(ErrorStore).to(ErrorStore).inSingletonScope();
  container.bind(LoadingStore).to(LoadingStore).inSingletonScope();
  container.bind(FilterStateStore).to(FilterStateStore).inSingletonScope();
  container.bind(SchemaStore).to(SchemaStore).inSingletonScope();
  container.bind(FilterQueryStore).to(FilterQueryStore).inSingletonScope();
  container.bind(QueryResultStore).to(QueryResultStore).inSingletonScope();
  container
    .bind(EntityStyleStore)
    .toDynamicValue(
      (context) =>
        new EntityStyleStore(context.container.get(SearchSelectionStore))
    )
    .inSingletonScope();

  container.bind(ShortestPathStateStore).toSelf().inSingletonScope();
  container.bind(ExplorationStore).toSelf().inSingletonScope();
  container.bind(SearchSelectionStore).toSelf().inSingletonScope();
  container.bind(EntityDetailsStateStore).toSelf().inSingletonScope();
}
