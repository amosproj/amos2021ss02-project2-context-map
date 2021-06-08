import EntityStyle, { NodeStyle } from './EntityStyle';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';

export type EntityStyleProvider = {
  (edge: EdgeDescriptor): EntityStyle;
  (node: NodeDescriptor): NodeStyle;
};
