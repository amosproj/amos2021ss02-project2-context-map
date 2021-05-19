import React, { SyntheticEvent, useState } from 'react';
import {
  Card,
  CardContent,
  ClickAwayListener,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListSubheader,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import useService from '../dependency-injection/useService';
import SearchService from '../services/searchService';
import './SearchResultList.scss';
import SearchResultList from './SearchResultList';
import convertSearchResultToSearchResultList from './SearchEntryConverter';

export default function Searchbar(): JSX.Element {
  const searchService = useService(SearchService, null);
  /**
   * {
   *   header: Items[]
   * }
   */
  const [searchResults, setSearchResults] = useState<SearchResultList[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onInputChanged = (event: SyntheticEvent) => {
    const newValue = (event.target as HTMLInputElement).value;
    setMenuOpen(newValue?.length > 0);

    if (newValue?.length > 0) {
      searchService
        .fullTextSearch(newValue)
        .then(async (result) => convertSearchResultToSearchResultList(result))
        .then((result) => setSearchResults(result))
        .catch((error) => {
          // eslint-disable-next-line no-console -- TODO what can we really do with the error here?
          console.error(error);
        });
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <div>
          <Input
            ref={inputRef}
            type="text"
            autoComplete="off"
            onChange={onInputChanged}
            onClick={() => setMenuOpen(true)}
            color="secondary"
            style={{ width: '100%' }}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
          {menuOpen && searchResults.length > 0 ? (
            <Card
              className="SearchResultsCard"
              style={{ width: `${inputRef.current?.clientWidth ?? 0}px` }}
            >
              <CardContent>
                <List subheader={<li />}>
                  {searchResults.map((searchResult) => (
                    <li key={searchResult.key}>
                      <ul className="SubList">
                        <ListSubheader>{searchResult.header}</ListSubheader>
                        {searchResult.elements.map((element) => (
                          <ListItem key={element.key}>
                            {element.element}
                          </ListItem>
                        ))}
                      </ul>
                    </li>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </ClickAwayListener>
    </>
  );
}
