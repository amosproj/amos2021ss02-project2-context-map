import { Container } from 'inversify';
import RandomNumberGenerator from './services/RandomNumberGenerator';
import RandomNumberGeneratorImpl from './services/RandomNumberGeneratorImpl';

/**
 * Configures all services in the frontend app.
 * @param container The dependency injection container.
 * @description See https://inversify.io/ for details of the configuration or https://github.com/inversify/InversifyJS/blob/master/wiki/classes_as_id.md for a starting point.
 */
export default function configureServices(container: Container): void {
  // A service used for testing the DI setup
  container
    .bind<RandomNumberGenerator>(RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl);

  // Add your services here...
}
