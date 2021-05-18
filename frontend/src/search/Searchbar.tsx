import React from 'react';
import AsyncSelect from 'react-select/async';
import useService from '../dependency-injection/useService';
import SearchService from '../services/searchService';
import { SearchResultEntryGroup } from './SearchResultEntryGroup';
import convertSearchResultToEntryGroups from './SearchEntryConverter';

export default function Searchbar(): JSX.Element {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any -- no use for the explicit type  */
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };
  const searchService = useService(SearchService, null);

  const searchEntries = function executeSearch(
    inputValue: string,
    callback: (entryGroups: SearchResultEntryGroup[]) => void
  ) {
    searchService
      .fullTextSearch(inputValue)
      .then((result) => callback(convertSearchResultToEntryGroups(result)))
      // TODO what can we really do with the error here?
      .catch((error) => error);
  };

  /* eslint-disable react/jsx-no-bind -- simpler binding for stateless components  */
  return (
    <AsyncSelect
      styles={customStyles}
      placeholder="Search nodes/edges/entities..."
      cacheOptions
      loadOptions={searchEntries}
    />
  );
}
