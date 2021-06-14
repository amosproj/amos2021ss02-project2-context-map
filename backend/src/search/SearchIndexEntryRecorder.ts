import { IndexEntry } from './IndexEntry';
import { Node, Edge } from '../shared/entities';
import { EdgeType, EntityType, NodeType } from '../shared/schema';
import { flattenArray } from '../utils/flattenArray';
import { convertToString } from '../utils/convertToString';

/**
 * Represents a recorder for all possible types of search-index entries.
 */
export class SearchIndexEntryRecorder {
  private readonly entries: IndexEntry[] = [];

  /**
   * Gets the recorded collection of index entries.
   */
  public get recordedEntries(): IndexEntry[] {
    return this.entries;
  }

  /**
   * Translated an edge to an index-entry and records it.
   * @param edge The edge to translate.
   * @returns The translated edge.
   */
  public recordEdge(edge: Edge): void {
    // For an edge, we want to search in the if of the edge, in the name of the entity-type of edge
    // and in the values of all the properties.
    const entityIdEntry: IndexEntry = {
      entityType: 'edge',
      id: edge.id,
      types: [edge.type],
      to: edge.to,
      from: edge.from,
      indexKey: 'id',
      indexValue: edge.id.toString(),
    };

    this.entries.push(entityIdEntry);

    const entityTypeEntry: IndexEntry = {
      entityType: 'edge',
      id: edge.id,
      types: [edge.type],
      to: edge.to,
      from: edge.from,
      indexKey: 'type',
      indexValue: edge.type,
    };

    this.entries.push(entityTypeEntry);

    const keys = Object.keys(edge.properties);

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      const value = <unknown>edge.properties[key];
      const stringifiedValue = convertToString(value);

      if (stringifiedValue) {
        this.entries.push({
          entityType: 'edge',
          id: edge.id,
          types: [edge.type],
          to: edge.to,
          from: edge.from,
          indexKey: `properties.${key}`,
          indexValue: stringifiedValue,
        });
      }
    }
  }

  /**
   * Translated a node to an index-entry and records it.
   * @param node The node to translate.
   * @returns The translated node.
   */
  public recordNode(node: Node): void {
    // For a node, we want to search in the if of the node, in the name of the entity-type of node
    // and in the values of all the properties.
    const entityIdEntry: IndexEntry = {
      entityType: 'node',
      id: node.id,
      types: node.types,
      indexKey: 'id',
      indexValue: node.id.toString(),
    };

    this.entries.push(entityIdEntry);

    const entityTypeEntry: IndexEntry = {
      entityType: 'node',
      id: node.id,
      types: node.types,
      indexKey: 'type',
      indexValue: flattenArray(node.types),
    };

    this.entries.push(entityTypeEntry);

    const keys = Object.keys(node.properties);

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      const value = <unknown>node.properties[key];
      const stringifiedValue = convertToString(value);

      if (stringifiedValue) {
        this.entries.push({
          entityType: 'node',
          id: node.id,
          types: node.types,
          indexKey: `properties.${key}`,
          indexValue: stringifiedValue,
        });
      }
    }
  }

  /**
   * Translates an entity-type to an index-entry and records it.
   * @param entityType The entity-type to translates.
   * @param type The type of entity the translation affects. This is either a node-type or an edge-type.
   * @returns The translated entity-type.
   */
  private recordEntityType(
    entityType: EntityType,
    type: 'node-type' | 'edge-type'
  ): void {
    // We store an entity type as index entry in the following way:
    // The id of the entry is the name of the type,
    // There is a single entry-property thats name is `property`and thats value is the concatenated names of
    // all properties the entity-type contains.
    // For example:
    // A node of type Person consists of the properties 'name', 'born', 'address'.
    // The index entry looks like:
    // { id: 'Person', indexValue: '[name, born, address]' }

    // For an entity-type, we want to search in the name of the entity-type
    // and in the name of the properties, so we have to insert two entries into the index.
    const entityTypeNameEntry = {
      entityType: type,
      id: entityType.name,
      indexKey: 'id',
      indexValue: entityType.name,
    };

    this.entries.push(entityTypeNameEntry);

    if (entityType.properties.length > 0) {
      const entityTypePropertiesEntry = {
        entityType: type,
        id: entityType.name,
        indexKey: 'properties.properties',
        indexValue: flattenArray(
          entityType.properties.map((prop) => prop.name)
        ),
      };

      this.entries.push(entityTypePropertiesEntry);
    }
  }

  /**
   * Translates an edge-type to an index-entry and records it.
   * @param edgeType The edge-type to translate.
   * @returns The translated edge-type.
   */
  public recordEdgeType(edgeType: EdgeType): void {
    const nodeEntityEntry: IndexEntry = {
      entityType: 'edge-type',
      id: edgeType.name,
      indexKey: 'entity-type',
      indexValue: 'edge',
    };

    this.entries.push(nodeEntityEntry);

    this.recordEntityType(edgeType, 'edge-type');
  }

  /**
   * Translates a node-type to an index-entry and records it.
   * @param nodeType The node-type to translate.
   * @returns The translated node-type.
   */
  public recordNodeType(nodeType: NodeType): void {
    const nodeEntityEntry: IndexEntry = {
      entityType: 'node-type',
      id: nodeType.name,
      indexKey: 'entity-type',
      indexValue: 'node',
    };

    this.entries.push(nodeEntityEntry);

    this.recordEntityType(nodeType, 'node-type');
  }
}
