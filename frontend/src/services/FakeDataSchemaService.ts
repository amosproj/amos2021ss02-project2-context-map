import { injectable } from 'inversify';
import 'reflect-metadata';
import { EdgeType } from '../shared/schema/EdgeType';
import { EntityType } from '../shared/schema/EntityType';
import { EntityTypeAttribute } from '../shared/schema/EntityTypeAttribute';
import { NodeType } from '../shared/schema/NodeType';
import { CancellationToken } from '../utils/CancellationToken';
import delay from '../utils/delay';
import nouns from '../utils/nouns';
import withCancellation from '../utils/withCancellation';
import getRandomIndex from '../utils/getRandomIndex';
import SchemaService from './SchemaService';

// TODO: What else is possible?
export const possibleAttributeTypes: string[] = [
  'String',
  'Long',
  'StringArray',
];

@injectable()
export class FakeDataSchemaService extends SchemaService {
  private readonly usedNounIndices: Set<number> = new Set<number>();

  private edgeTypesPromise: Promise<EdgeType[]> | null = null;

  private nodeTypesPromise: Promise<NodeType[]> | null = null;

  private getRandomNoun(): string {
    let nounIndex = getRandomIndex(nouns.length);

    while (this.usedNounIndices.has(nounIndex)) {
      nounIndex = getRandomIndex(nouns.length);
    }

    this.usedNounIndices.add(nounIndex);
    return nouns[nounIndex];
  }

  private generateRandomEntityTypeAttribute(): EntityTypeAttribute {
    const name = this.getRandomNoun();

    // Build the string array that contains the types the attribute may contain.
    // The possible types are stored in a constant.
    const types: string[] = [];

    // Get a random number in the range [1..possibleAttributeTypes.length[ that determines
    // the amount of types that the array will contain.
    const numberOfTypes = getRandomIndex(possibleAttributeTypes.length - 1) + 1;

    // A copy of the possibleAttributeTypes, as we modify this list now.
    const nonAllocatedAttributeTypes = [...possibleAttributeTypes];

    for (let i = 0; i < numberOfTypes; i += 1) {
      // First get an index into the collection of not yet allocated attribute types.
      const idx = getRandomIndex(nonAllocatedAttributeTypes.length);

      // Add the attribute type to the collection.
      types.push(nonAllocatedAttributeTypes[idx]);

      // Remove the attribute type from the collection of non allocated attribute types,
      // as we just allocated it.
      nonAllocatedAttributeTypes.splice(idx, 1);
    }

    const mandatory = getRandomIndex(1) === 1;

    return { name, types: <[string]>types, mandatory };
  }

  private generateRandomEntityType(): EntityType {
    const name = this.getRandomNoun();
    const numberOfAttributes = getRandomIndex(20);
    const attributes: EntityTypeAttribute[] = [];

    for (let i = 0; i < numberOfAttributes; i += 1) {
      attributes.push(this.generateRandomEntityTypeAttribute());
    }

    return { name, attributes };
  }

  public generateRandomEntityTypes(max: number): EntityType[] {
    const numberOfEdgeTypes = getRandomIndex(max);
    const edgeTypes: EntityType[] = [];

    for (let i = 0; i < numberOfEdgeTypes; i += 1) {
      edgeTypes.push(this.generateRandomEntityType());
    }

    return edgeTypes;
  }

  public getEdgeTypes(cancellation?: CancellationToken): Promise<EdgeType[]> {
    if (!this.edgeTypesPromise) {
      this.edgeTypesPromise = this.buildEdgeTypes();
    }

    // Cancel only the promise we are handing back to the caller, not the underlying operation
    // as the result will be added to the cache. 
    return withCancellation(this.edgeTypesPromise, cancellation);
  }

  private async buildEdgeTypes(): Promise<EdgeType[]> {
    await delay(1000);
    return this.generateRandomEntityTypes(30);
  }

  public getNodeTypes(cancellation?: CancellationToken): Promise<NodeType[]> {
    if (!this.nodeTypesPromise) {
      this.nodeTypesPromise = this.buildNodeTypes();
    }

    // Cancel only the promise we are handing back to the caller, not the underlying operation
    // as the result will be added to the cache. 
    return withCancellation(this.nodeTypesPromise, cancellation);
  }

  private async buildNodeTypes(): Promise<NodeType[]> {
    await delay(800);
    return this.generateRandomEntityTypes(20);
  }
}
