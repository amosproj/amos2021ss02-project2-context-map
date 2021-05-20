import { EdgeTypeDescriptor } from './EdgeTypeDescriptor';
import { EntityType } from './EntityType';

/**
 * Represents a type of an edge in a graph
 * (e.g. Person, not Person[name='Peter'])
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EdgeType extends EntityType, EdgeTypeDescriptor {}
