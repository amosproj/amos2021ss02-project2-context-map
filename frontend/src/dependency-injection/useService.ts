import { interfaces } from 'inversify';
import useContainer from './useContainer';

/**
 * A hook that accesses a service specified inside of a react component.
 * @param serviceIdentifier The service identifier.
 * @param existing The existing service, that is returned, if specified and not null.
 * @returns The service requested.
 * @description Typical use: `const myService = useService(MyService)`
 */
export default function useService<T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>,
  existing?: T | null | undefined
): T {
  // We have to fetch from the container unconditionally, because this is a requirement of react hooks.
  // Throw away the value, if we do not need it.
  const fromContainer = useContainer().get<T>(serviceIdentifier);

  return existing ?? fromContainer;
}
