import { NodeStyle, EdgeStyle } from './EntityStyle';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';

export interface EntityStyleProvider {
  getStyle: {
    (edge: EdgeDescriptor): EdgeStyle;
    (node: NodeDescriptor): NodeStyle;
  };
}
