import { Container, interfaces } from 'inversify';
import configureServices from '../configureServices';

export default class ContainerBuilder {
  private readonly options: interfaces.ContainerOptions;

  constructor(options: interfaces.ContainerOptions = {}) {
    this.options = options ?? {};
  }

  public buildContainer(): Container {
    const container = new Container(this.options);
    configureServices(container);
    return container;
  }
}
