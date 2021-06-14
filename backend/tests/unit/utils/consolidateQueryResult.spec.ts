import { consolidateQueryResult } from '../../../src/utils';

describe('consolidateQueryResult', () => {
  it('deduplicates nodes', async () => {
    // Arrange
    const queryResult = {
      nodes: [
        { id: 1, types: ['Person'] },
        { id: 2, types: ['Person'] },
        { id: 1, types: ['Person'] },
      ],
      edges: [],
    };

    const expectedQueryResult = {
      nodes: [
        { id: 1, types: ['Person'] },
        { id: 2, types: ['Person'] },
      ],
      edges: [],
    };

    // Act
    const consolidatedQueryResult = consolidateQueryResult(queryResult);

    // Assert
    expect(consolidatedQueryResult).toStrictEqual(expectedQueryResult);
  });

  it('deduplicates edges', async () => {
    // Arrange
    const queryResult = {
      nodes: [{ id: 0, types: ['Movie'] }],
      edges: [
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 2, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
      ],
    };

    const expectedQueryResult = {
      nodes: [{ id: 0, types: ['Movie'] }],
      edges: [
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 2, type: 'ACTED_IN', from: 0, to: 0 },
      ],
    };

    // Act
    const consolidatedQueryResult = consolidateQueryResult(queryResult);

    // Assert
    expect(consolidatedQueryResult).toStrictEqual(expectedQueryResult);
  });

  it('removed edges that reference non included nodes', async () => {
    // Arrange
    const queryResult = {
      nodes: [{ id: 0, types: ['Movie'] }],
      edges: [
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 2, type: 'ACTED_IN', from: 0, to: 1 },
      ],
    };

    const expectedQueryResult = {
      nodes: [{ id: 0, types: ['Movie'] }],
      edges: [{ id: 1, type: 'ACTED_IN', from: 0, to: 0 }],
    };

    // Act
    const consolidatedQueryResult = consolidateQueryResult(queryResult);

    // Assert
    expect(consolidatedQueryResult).toStrictEqual(expectedQueryResult);
  });

  it('adds subsidiary nodes that are non included but referenced by included edges', async () => {
    // Arrange
    const queryResult = {
      nodes: [{ id: 0, types: ['Movie'] }],
      edges: [
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 2, type: 'ACTED_IN', from: 0, to: 1 },
      ],
    };

    const expectedQueryResult = {
      nodes: [
        { id: 0, types: ['Movie'] },
        { id: 1, types: [], subsidiary: true },
      ],
      edges: [
        { id: 1, type: 'ACTED_IN', from: 0, to: 0 },
        { id: 2, type: 'ACTED_IN', from: 0, to: 1 },
      ],
    };

    // Act
    const consolidatedQueryResult = consolidateQueryResult(queryResult, true);

    // Assert
    expect(consolidatedQueryResult).toStrictEqual(expectedQueryResult);
  });
});
