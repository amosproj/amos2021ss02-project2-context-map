import { injectable } from 'inversify';
import SimpleStore from './SimpleStore';
import 'reflect-metadata';

@injectable()
export default class ErrorStore extends SimpleStore<Error | null> {
  protected getInitialValue(): Error | null {
    return null;
  }
}
