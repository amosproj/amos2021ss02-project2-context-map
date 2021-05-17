import HttpHeaderCollection from './HttpHeaderCollection';
import URLQuery from './URLQuery';

export default abstract class HttpRequest {
  public constructor(
    public readonly headers: HttpHeaderCollection = {},
    public readonly query: URLQuery = {}
  ) {}
}
