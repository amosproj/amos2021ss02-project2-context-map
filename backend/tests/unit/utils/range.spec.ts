import { range } from '../../../src/utils';

describe('range', () => {
  it('returns empty array if end is 0', async () => {
    // Arrange
    const expectedResult: number[] = [];

    // Act
    const result = range(0);

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('returns empty array if start equals end', async () => {
    // Arrange
    const expectedResult: number[] = [];

    // Act
    const result = range(5, 5);

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('returns sequence up to but not including end', async () => {
    // Arrange
    const expectedResult: number[] = [0, 1, 2, 3, 4];

    // Act
    const result = range(5);

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('returns sequence from start up to but not including end', async () => {
    // Arrange
    const expectedResult: number[] = [2, 3, 4];

    // Act
    const result = range(2, 5);

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });
});
