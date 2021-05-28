/* istanbul ignore file -- will be refactored so we ignore coverage */

type FactoryFunction<T> = () => Promise<T>;

export interface AsyncLazyOptions {
  retryOnError: boolean;
}

function buildOptions(options: Partial<AsyncLazyOptions>): AsyncLazyOptions {
  return {
    retryOnError: options.retryOnError ?? false,
  };
}

export default class AsyncLazy<T> {
  private readonly options: AsyncLazyOptions;
  private readonly factory: FactoryFunction<T>;
  private promise: Promise<T> | null = null;
  private rejected = false;

  public constructor(
    factory: FactoryFunction<T>,
    options: Partial<AsyncLazyOptions> = {}
  ) {
    this.options = buildOptions(options);
    this.factory = this.applyOptions(factory, this.options);
  }

  private applyOptions(
    factory: FactoryFunction<T>,
    options: AsyncLazyOptions
  ): FactoryFunction<T> {
    let result = factory;

    if (options.retryOnError) {
      result = async (): Promise<T> => {
        try {
          return await factory();
        } catch (error) {
          this.rejected = true;
          throw error;
        }
      };
    }

    return result;
  }

  public get isStarted(): boolean {
    return this.promise !== null;
  }

  public start(): void {
    this.startAndGetValue();
  }

  public get value(): Promise<T> {
    return this.startAndGetValue();
  }

  private startAndGetValue(): Promise<T> {
    if (this.promise === null || (this.rejected && this.options.retryOnError)) {
      this.promise = this.factory();
    }

    return this.promise;
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
    /* eslint-enable @typescript-eslint/no-explicit-any */
  ): Promise<TResult1 | TResult2> {
    const promise = this.startAndGetValue();
    return promise.then(onfulfilled, onrejected);
  }
}
