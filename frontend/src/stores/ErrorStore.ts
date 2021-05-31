import SimpleStore from './SimpleStore';

export default class ErrorStore extends SimpleStore<Error | null> {
  protected getInitialValue(): Error | null {
    return null;
  }
}
