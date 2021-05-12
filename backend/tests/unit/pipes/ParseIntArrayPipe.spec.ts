import { ArgumentMetadata } from '@nestjs/common';
import { ParseIntArrayPipe } from '../../../src/pipes/ParseIntArrayPipe';

describe('ParseIntArrayPipe', () => {
  const pipe = new ParseIntArrayPipe();
  const metadata: ArgumentMetadata = {
    type: 'query',
  };

  describe('single value input', () => {
    it('should return int array when called with int', async () => {
      // Act & Assert
      await expect(pipe.transform(1, metadata)).resolves.toStrictEqual([1]);
    });

    it('should return int array when called with string', async () => {
      // Act & Assert
      await expect(pipe.transform('2', metadata)).resolves.toStrictEqual([2]);
    });
  });

  describe('array input', () => {
    it('should return int array when called with int array', async () => {
      // Act & Assert
      await expect(
        pipe.transform([1, 2, 3, 4], metadata)
      ).resolves.toStrictEqual([1, 2, 3, 4]);
    });

    it('should return int array when called with string array', async () => {
      // Act & Assert
      await expect(
        pipe.transform(['1', '2', '3'], metadata)
      ).resolves.toStrictEqual([1, 2, 3]);
    });
  });

  it('should throw an Error when called with neither number or string', async () => {
    // Act & Assert
    await expect(pipe.transform(true, metadata)).rejects.toThrowError();
  });
});
