import { interfaces } from "inversify";
import { useContainer } from "./useContainer";

/**
 * A hook that accesses a service specified inside of a react component.
 * @param serviceIdentifier The service identifier.
 * @returns The service requested.
 * @description Typical use: `const myService = useService<MyService>(MyService)`
 */
export function useService<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) : T {
    return useContainer().get<T>(serviceIdentifier);
}