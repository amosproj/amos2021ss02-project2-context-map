import { Container } from 'inversify';
import HttpService from './services/http';
import QueryService from './services/QueryService';
import QueryServiceImpl from './services/QueryServiceImpl';
import RandomNumberGenerator from './services/RandomNumberGenerator';
import RandomNumberGeneratorImpl from './services/RandomNumberGeneratorImpl';
import SearchService from './services/searchService';
import SearchServiceImpl from './services/SearchServiceImpl';
import { FilterService, FilterServiceImpl } from './services/filter';
import { SchemaService, SchemaServiceImpl } from './services/schema';

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

  // Add your services here...
}
