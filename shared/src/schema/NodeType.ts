import { EntityType } from './EntityType';
import { NodeTypeDescriptor } from './NodeTypeDescriptor';

/**
 * Represents a type of a node in a graph
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeType extends EntityType, NodeTypeDescriptor {}
