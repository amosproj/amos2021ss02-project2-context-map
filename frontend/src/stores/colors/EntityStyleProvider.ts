import 'reflect-metadata';
import { injectable } from 'inversify';
import { NodeStyle, EdgeStyle } from './EntityStyle';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';

@injectable()
// eslint-disable-next-line import/prefer-default-export
export abstract class EntityStyleProvider {
  public abstract getStyle: {
    (edge: EdgeDescriptor): EdgeStyle;
    (node: NodeDescriptor): NodeStyle;
  };
}
