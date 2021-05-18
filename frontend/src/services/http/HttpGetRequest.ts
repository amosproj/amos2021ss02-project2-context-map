import HttpHeaderCollection from './HttpHeaderCollection';
import URLQuery from './URLQuery';
import HttpRequest from './HttpRequest';

export default class HttpGetRequest extends HttpRequest {
  public constructor(headers: HttpHeaderCollection = {}, query: URLQuery = {}) {
    super(headers, query);
  }
}
