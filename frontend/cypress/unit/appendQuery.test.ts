import appendQuery from '../../src/services/http/appendQuery';

describe('appendQuery', () => {
  let url: URL;
  const baseUrl = 'https://example.com';

  beforeEach(() => {
    url = new URL(baseUrl);
  });

  it('should not change input href on empty input', () => {
    const actual = appendQuery(url, {});
    expect(actual.href).to.be.eq(`${url.href}`);
  });

  it('should be able to handle strings', () => {
    const actual = appendQuery(url, { example: 'successful' });
    expect(actual.href).to.be.eq(`${url.href}?example=successful`);
  });

  it('should be able to handle numbers', () => {
    const actual = appendQuery(url, { example: 42 });
    expect(actual.href).to.be.eq(`${url.href}?example=42`);
  });

  it('should be able to handle arrays', () => {
    const actual = appendQuery(url, { example: [1, 2, 3] });
    expect(actual.href).to.be.eq(`${url.href}?example=1&example=2&example=3`);
  });

  describe('appending query', () => {
    it('should be able to append to given queries', () => {
      url = new URL(`${baseUrl}?given=1`);
      const actual = appendQuery(url, { example: [1, 2, 3] });
      expect(actual.href).to.be.eq(`${url.href}&example=1&example=2&example=3`);
    });

    it('should be able to append to given empty query', () => {
      url = new URL(`${baseUrl}?`);
      const actual = appendQuery(url, { example: [1, 2, 3] });
      expect(actual.href).to.be.eq(`${url.href}example=1&example=2&example=3`);
    });
  });
});
