import HttpHeaderCollection from './HttpHeaderCollection';
import URLQuery from './URLQuery';
import HttpRequest from './HttpRequest';

export default class HttpPostRequest extends HttpRequest {
  public constructor(
    public readonly body: unknown,
    headers: HttpHeaderCollection = {},
    query: URLQuery = {}
  ) {
    super(headers, query);
  }
}
