import { injectable } from 'inversify';
import 'reflect-metadata';
import { EdgeType } from '../shared/schema/EdgeType';
import { EntityType } from '../shared/schema/EntityType';
import { EntityTypeProperty } from '../shared/schema/EntityTypeProperty';
import { NodeType } from '../shared/schema/NodeType';
import { CancellationToken } from '../utils/CancellationToken';
import delay from '../utils/delay';
import nouns from '../utils/nouns';
import withCancellation from '../utils/withCancellation';
import getRandomInteger from '../utils/getRandomInteger';
import SchemaService from './SchemaService';

// TODO: What else is possible?
export const possiblePropertyTypes: string[] = [
  'String',
  'Long',
  'StringArray',
];

@injectable()
export default class FakeDataSchemaService extends SchemaService {
  /* eslint-disable lines-between-class-members */
  private readonly usedNounIndices: Set<number> = new Set<number>();
  private readonly minNumberOfNodeTypes = 5;
  private readonly maxNumberOfNodeTypes = 25;
  private readonly minNumberOfEdgeTypes = 5;
  private readonly maxNumberOfEdgeTypes = 25;
  private readonly minNumberOfProperties = 0;
  private readonly maxNumberOfProperties = 20;
  private edgeTypesPromise: Promise<EdgeType[]> | null = null;
  private nodeTypesPromise: Promise<NodeType[]> | null = null;
  /* eslint-enable lines-between-class-members */

  private getRandomNoun(): string {
    let nounIndex = getRandomInteger(nouns.length);

    while (this.usedNounIndices.has(nounIndex)) {
      nounIndex = getRandomInteger(nouns.length);
    }

    this.usedNounIndices.add(nounIndex);
    return nouns[nounIndex];
  }

  private generateRandomEntityTypeProperty(): EntityTypeProperty {
    const name = this.getRandomNoun();

    // Build the string array that contains the types the property may contain.
    // The possible types are stored in a constant.
    const types: string[] = [];

    // Get a random number in the range [1..possiblePropertyTypes.length[ that determines
    // the amount of types that the array will contain.
    const numberOfTypes = getRandomInteger(1, possiblePropertyTypes.length);

    // A copy of the possiblePropertyTypes, as we modify this list now.
    const nonAllocatedPropertyTypes = [...possiblePropertyTypes];

    for (let i = 0; i < numberOfTypes; i += 1) {
      // First get an index into the collection of not yet allocated property types.
      const idx = getRandomInteger(nonAllocatedPropertyTypes.length);

      // Add the property type to the collection.
      types.push(nonAllocatedPropertyTypes[idx]);

      // Remove the property type from the collection of non allocated property types,
      // as we just allocated it.
      nonAllocatedPropertyTypes.splice(idx, 1);
    }

    const mandatory = getRandomInteger(1) === 1;

    return { name, types: <[string]>types, mandatory };
  }

  private generateRandomEntityType(): EntityType {
    const name = this.getRandomNoun();
    const numberOfProperties = getRandomInteger(
      this.minNumberOfProperties,
      this.maxNumberOfProperties
    );
    const properties: EntityTypeProperty[] = [];

    for (let i = 0; i < numberOfProperties; i += 1) {
      properties.push(this.generateRandomEntityTypeProperty());
    }

    return { name, properties };
  }

  public generateRandomEntityTypes(min: number, max: number): EntityType[] {
    const numberOfEntityTypes = getRandomInteger(min, max);
    const entityTypes: EntityType[] = [];

    for (let i = 0; i < numberOfEntityTypes; i += 1) {
      entityTypes.push(this.generateRandomEntityType());
    }

    return entityTypes;
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
    return this.generateRandomEntityTypes(
      this.minNumberOfEdgeTypes,
      this.maxNumberOfEdgeTypes
    );
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
    return this.generateRandomEntityTypes(
      this.minNumberOfNodeTypes,
      this.maxNumberOfNodeTypes
    );
  }
}
