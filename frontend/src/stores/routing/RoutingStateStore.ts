import 'reflect-metadata';
import { injectable } from 'inversify';
import SimpleStore from '../SimpleStore';

export interface RoutingState {
  location: string;
}

@injectable()
export class RoutingStateStore extends SimpleStore<RoutingState> {
  protected getInitialValue(): RoutingState {
    return { location: '' };
  }
}
