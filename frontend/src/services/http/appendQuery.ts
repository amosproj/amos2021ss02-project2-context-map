import URLQuery from './URLQuery';

export default function appendQuery(url: URL, query: URLQuery): URL {
  let queryString = '';
  const keys = Object.keys(query);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = query[key];

    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j += 1) {
        const arrayValue = value[j];
        if (i > 0 || j > 0) {
          queryString += '&';
        }
        queryString += `${key}=${arrayValue.toString()}`;
      }
    } else {
      if (i > 0) {
        queryString += '&';
      }
      queryString += `${key}=${value.toString()}`;
    }
  }

  // Copy the url, so we don't touch the object of the caller,
  // that maybe reused for other stuff, we cannot know of.
  const result = new URL(url.href);

  if (queryString.length > 0) {
    if (
      !result.search ||
      result.search.length === 0 ||
      (result.search.length === 1 && result.search.charAt(0) === '?')
    ) {
      result.search = `?${queryString}`;
    } else {
      result.search = `${result.search}&${queryString}`;
    }
  }

  return result;
}
