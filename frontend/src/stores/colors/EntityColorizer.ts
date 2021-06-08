import EntityStyle, { NodeStyle } from './EntityStyle';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';
import { Entity } from './EntityColorStore';

export type EntityColorizer<E extends Entity = Entity> = (
  entity: Entity
) => E extends EdgeDescriptor
  ? EntityStyle
  : E extends NodeDescriptor
  ? NodeStyle
  : never;
