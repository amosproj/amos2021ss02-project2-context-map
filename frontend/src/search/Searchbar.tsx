import React from 'react';
import AsyncSelect from 'react-select/async';
import { SearchResultEntry } from './SearchResultEntry';
import useService from '../dependency-injection/useService';
import SearchService from '../services/searchService';
import convertSearchResultToEntries from './SearchEntryConverter';

export default function Searchbar(): JSX.Element {
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };

  const searchService = useService(SearchService, null);

  const loadOptions = function (
    inputValue: string,
    callback: (entries: SearchResultEntry[]) => void
  ) {
    searchService
      .fullTextSearch(inputValue)
      .then((result) => callback(convertSearchResultToEntries(result)));
    // TODO Error handling for bad requests
  };

  /* eslint-disable react/jsx-no-bind */
  return (
    <AsyncSelect styles={customStyles} cacheOptions loadOptions={loadOptions} />
  );
}
