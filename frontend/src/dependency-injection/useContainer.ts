import { useContext } from 'react';
import { Container } from 'inversify';
import { DependencyInjectionContext } from './DependencyInjectionContext';

/**
 * A hook that accesses the dependency injection container inside of a react component.
 * @returns The dependency injection container.
 */
export default function useContainer(): Container {
  return useContext(DependencyInjectionContext);
}
