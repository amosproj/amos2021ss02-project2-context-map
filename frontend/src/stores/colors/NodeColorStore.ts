import { NodeDescriptor } from '../../shared/entities';
import BaseEntityColorStore, { EntityColorizer } from './BaseEntityColorStore';

export type NodeColorizer = EntityColorizer<NodeDescriptor>;

export default class NodeColorStore extends BaseEntityColorStore<NodeDescriptor> {
  protected getTypeOfEntity(nodeDescriptor: NodeDescriptor): string {
    return nodeDescriptor.types
      .map((x) => x)
      .sort((a, b) => a.localeCompare(b))
      .join(' ');
  }
}
