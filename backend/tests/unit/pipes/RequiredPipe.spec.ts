import { RequiredPipe } from '../../../src/pipes/RequiredPipe';

describe('ParseIntArrayPipe', () => {
  const pipe = new RequiredPipe();

  it('should return the argument (int)', async () => {
    // Act & Assert
    expect(pipe.transform(1)).toStrictEqual(1);
  });

  it('should return the argument (string)', async () => {
    // Act & Assert
    expect(pipe.transform('2')).toStrictEqual('2');
  });

  it('should return the argument (object)', async () => {
    // Act & Assert
    expect(pipe.transform({})).toStrictEqual({});
  });

  it('should return throw an error if called with undefined', async () => {
    // Act & Assert
    expect(() => pipe.transform(undefined)).toThrow();
  });

  it('should return throw an error if called with empty string', async () => {
    // Act & Assert
    expect(() => pipe.transform('')).toThrow();
  });
});
