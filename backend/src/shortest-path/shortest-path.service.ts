import { Path } from './Path';
import { ShortestPathServiceBase } from './shortest-path.service.base';

export class ShortestPathService implements ShortestPathServiceBase {
  public findShortedPath(): Promise<Path | null> {
    throw Error('Not implemented');
  }
}
