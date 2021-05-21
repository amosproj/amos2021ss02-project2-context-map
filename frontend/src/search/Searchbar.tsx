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

import './Searchbar.scss';
import LimitListSizeComponent from './helper/LimitListSizeComponent';
import QueryService from '../services/QueryService';

export default function Searchbar(): JSX.Element {
  const searchService = useService(SearchService);
  const queryService = useService(QueryService);
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
        .then(async (result) =>
          convertSearchResultToSearchResultList(newValue, {
            edges:
              result.edges.length > 0
                ? await queryService.getEdgesById(result.edges)
                : [],
            nodes:
              result.nodes.length > 0
                ? await queryService.getNodesById(result.nodes)
                : [],
            edgeTypes: result.edgeTypes,
            nodeTypes: result.nodeTypes,
          })
        )
        .then((result) => setSearchResults(result))
        .catch((error) => {
          // eslint-disable-next-line no-console -- TODO what can we really do with the error here?
          console.error(error);
        });
    }
  };

  return (
    <div className="SearchBar">
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
                <List className="list" subheader={<li />}>
                  {searchResults.map((searchResult) => (
                    <li className="listSection" key={searchResult.key}>
                      <ul className="SubList">
                        <ListSubheader>{searchResult.header}</ListSubheader>
                        <LimitListSizeComponent
                          list={searchResult.elements.map((element) => (
                            <ListItem key={element.key}>
                              {element.element}
                            </ListItem>
                          ))}
                        />
                      </ul>
                    </li>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </ClickAwayListener>
    </div>
  );
}
