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
import GraphDataStore from './stores/GraphDataStore';
import FilterStore from './stores/FilterStore';

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

  // stores
  const filterStore = new FilterStore();
  container.bind(FilterStore).toConstantValue(filterStore);
  // if filterStore is injected like FilterService, then the injected filterStore
  // differs from all other FilterStores obtained in other parts of the app.
  container
    .bind(GraphDataStore)
    .toConstantValue(
      new GraphDataStore(filterStore, container.get(FilterService))
    );
}
