import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  MatchPropertyCondition,
  OfTypeCondition,
} from '../../../src/shared/queries';
import FilterConditionBuilder, {
  FilterConditionBuildResult,
} from '../../../src/filter/FilterConditionBuilder';

function inlineQueryParams(
  buildResult: FilterConditionBuildResult
): string | null {
  let result = buildResult.condition;
  const keys = Object.keys(buildResult.queryParams);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const value = buildResult.queryParams[key];
    if (typeof value === 'string') {
      result = result?.replace(RegExp(`\\$${key}`), value) ?? null;
    }
  }

  return result;
}

describe('FilterConditionBuilder', () => {
  it('returns none filter condition of filter is undefined', async () => {
    // Arrange
    const expectedResult: FilterConditionBuildResult = {
      condition: null,
      queryParams: {},
    };

    // Act
    const result = FilterConditionBuilder.buildFilterCondition('node', 'n');

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('translates node of-type filter correctly', async () => {
    // Arrange
    const filter: FilterCondition = OfTypeCondition('expected-type');
    const expectedResult = 'expected-type in labels(n)';

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('translates edge of-type filter correctly', async () => {
    // Arrange
    const filter: FilterCondition = OfTypeCondition('expected-type');
    const expectedResult = 'expected-type = type(e)';

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'edge',
      'e',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('translates match-property filter', async () => {
    // Arrange
    const filter: FilterCondition = MatchPropertyCondition('prop', 'val');
    const expectedResult = 'n[prop] = val';

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('returns null when translating match-all condition without containing filters', async () => {
    // Arrange
    const filter: FilterCondition = MatchAllCondition();
    const expectedResult = null;

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('returns null when translating match-any condition without containing filters', async () => {
    // Arrange
    const filter: FilterCondition = MatchAnyCondition();
    const expectedResult = null;

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('translates match-all filter correctly', async () => {
    // Arrange
    const filter: FilterCondition = MatchAllCondition(
      MatchPropertyCondition('prop', 'val'),
      OfTypeCondition('expected-type')
    );
    const expectedResult = '(n[prop] = val AND expected-type in labels(n))';

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });

  it('translates match-any filter correctly', async () => {
    // Arrange
    const filter: FilterCondition = MatchAnyCondition(
      MatchPropertyCondition('prop', 'val'),
      OfTypeCondition('expected-type')
    );
    const expectedResult = '(n[prop] = val OR expected-type in labels(n))';

    // Act
    const result = FilterConditionBuilder.buildFilterCondition(
      'node',
      'n',
      filter
    );

    // Assert
    expect(inlineQueryParams(result)).toBe(expectedResult);
  });
});
