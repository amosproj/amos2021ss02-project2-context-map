import HttpHeaderCollection from './HttpHeaderCollection';

export default class HttpResponse<TResult> {
  public constructor(
    public readonly result: TResult | null,
    public readonly headers: HttpHeaderCollection,
    public readonly status: number,
    public readonly statusText: string
  ) {}
}
