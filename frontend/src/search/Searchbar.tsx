import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import { Autorenew, Search } from '@material-ui/icons';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Link } from 'react-router-dom';
import useService from '../dependency-injection/useService';
import SearchService from '../services/searchService';
import './SearchResultList.scss';
import SearchResultList from './SearchResultList';
import convertSearchResultToSearchResultList from './SearchEntryConverter';

import './Searchbar.scss';
import LimitListSizeComponent from './helper/LimitListSizeComponent';
import QueryService from '../services/QueryService';
import { CancellationTokenSource } from '../utils/CancellationToken';
import CancellationError from '../utils/CancellationError';
import ErrorComponent from '../errors/ErrorComponent';

export default function Searchbar(): JSX.Element {
  const searchService = useService(SearchService);
  /**
   * Contains all the active cancel tokens.
   */
  const searchServiceCancelTokens = useRef<CancellationTokenSource[]>([]);

  const queryService = useService(QueryService);

  /**
   * Fires, when the search input is changes
   */
  const searchInput$ = useRef(new BehaviorSubject(''));

  // List that contains the search results
  const [searchResults, setSearchResults] = useState<SearchResultList[]>([]);

  const [error, setError] = useState<Error | undefined>(undefined);

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOngoing, setSearchOngoing] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  function loadSearchResults(searchString: string) {
    if (searchString?.length > 0) {
      const cancelToken = new CancellationTokenSource();
      searchServiceCancelTokens.current.push(cancelToken);
      setSearchOngoing(true);
      searchService
        .fullTextSearch(searchString, cancelToken.token)
        .then(async (result) =>
          convertSearchResultToSearchResultList(searchString, {
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
        .then((result) => {
          setSearchOngoing(false);
          setSearchResults(result);
          setError(undefined);
        })
        .catch((err) => {
          if (err instanceof CancellationError) return;
          setSearchOngoing(false);
          setError(err);
        });
    } else {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    const sub = searchInput$.current.pipe(debounceTime(300)).subscribe({
      next: (nextSearchString) => {
        searchServiceCancelTokens.current.forEach((q) => q.cancel());
        // noinspection StatementWithEmptyBodyJS -- Clear list
        while (searchServiceCancelTokens.current.pop());
        loadSearchResults(nextSearchString);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    searchInput$.current.next(event.target.value);
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
            endAdornment={
              searchOngoing ? (
                <InputAdornment className="LoadingIcon" position="end">
                  <Autorenew />
                </InputAdornment>
              ) : undefined
            }
          />
          {(menuOpen && searchResults.length > 0) || error ? (
            <Card
              className="SearchResultsCard"
              style={{ width: `${inputRef.current?.clientWidth ?? 0}px` }}
            >
              <CardContent>
                {error ? (
                  <ErrorComponent jsError={error} />
                ) : (
                  <List className="list" subheader={<li />}>
                    {searchResults.map((searchResult) => (
                      <li className="listSection" key={searchResult.key}>
                        <ul className="SubList">
                          <ListSubheader>{searchResult.header}</ListSubheader>
                          <LimitListSizeComponent
                            list={searchResult.elements.map((element) => (
                              <ListItem
                                key={element.key}
                                button
                                component={Link}
                                to={element.href}
                              >
                                {element.element}
                              </ListItem>
                            ))}
                          />
                        </ul>
                      </li>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </ClickAwayListener>
    </div>
  );
}
