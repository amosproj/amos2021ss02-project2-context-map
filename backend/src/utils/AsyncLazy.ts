type FactoryFunction<T> = () => Promise<T>;

export default class AsyncLazy<T> {
  private readonly factory: FactoryFunction<T>;

  private promise: Promise<T> | null = null;

  public constructor(factory: FactoryFunction<T>) {
    this.factory = factory;
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
    if (this.promise === null) {
      this.promise = this.factory();
    }

    return this.promise;
  }
}
