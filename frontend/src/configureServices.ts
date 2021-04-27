import { Container } from "inversify";
import { RandomNumberGenerator, RandomNumberGeneratorImpl } from "./services/RandomNumberGenerator";

/**
 * Configures all services in the frontend app.
 * @param container The dependency injection container.
 * @description See https://inversify.io/ for details of the configuration or https://github.com/inversify/InversifyJS/blob/master/wiki/classes_as_id.md for a starting point.
 */
export function configureServices(container: Container) {
    // A service used for testing the DI setup
    container.bind<RandomNumberGenerator>(RandomNumberGenerator).to(RandomNumberGeneratorImpl);

    // Add your services here...
}