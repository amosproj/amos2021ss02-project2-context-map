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
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Link } from 'react-router-dom';
import useService from '../dependency-injection/useService';
import { SearchService } from '../services/search';
import './SearchResultList.scss';
import SearchResultList from './SearchResultList';
import convertSearchResultToSearchResultList from './SearchEntryConverter';
import './Searchbar.scss';
import LimitListSizeComponent from './helper/LimitListSizeComponent';
import CancellationError from '../utils/CancellationError';
import ErrorComponent from '../errors/ErrorComponent';
import { EntityStyleStore } from '../stores/colors';
import useObservable from '../utils/useObservable';
import { SearchResult } from '../shared/search';
import SearchSelectionStore, {
  SelectedSearchResult,
} from '../stores/SearchSelectionStore';

export default function Searchbar(): JSX.Element {
  const searchService = useService(SearchService);
  const searchSelectionStore = useService(SearchSelectionStore);

  const entityStyleStore = useService(EntityStyleStore);

  /**
   * When next called, all ongoing searches are removed
   */
  const cancelSearchSubject = useRef(new Subject<void>());
  const cancelOngoingSearch = () => cancelSearchSubject.current.next();

  /**
   * Fires, when the search input is changes
   */
  const searchInput$ = useRef(new BehaviorSubject(''));

  // List that contains the search results
  const [searchResults, setSearchResults] = useState<SearchResultList[]>([]);

  const [error, setError] = useState<Error | undefined>(undefined);

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOngoing, setSearchOngoing] = useState(false);

  const [searchResult, setSearchResult] = useState<{
    searchString: string;
    result: SearchResult;
  }>({
    searchString: '',
    result: { nodes: [], edges: [], nodeTypes: [], edgeTypes: [] },
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const styleProvider = useObservable(
    entityStyleStore.getState(),
    entityStyleStore.getValue()
  );

  useEffect(() => {
    const result = convertSearchResultToSearchResultList(
      searchResult.searchString,
      searchResult.result,
      styleProvider
    );
    setSearchOngoing(false);
    setSearchResults(result);
    setError(undefined);
  }, [styleProvider, searchResult]);

  function loadSearchResults(searchString: string) {
    if (searchString?.length > 0) {
      setSearchOngoing(true);
      searchService
        .fullTextSearch(searchString)
        .pipe(takeUntil(cancelSearchSubject.current))
        .subscribe({
          next: (result) => setSearchResult({ searchString, result }),
          error: (err) => {
            if (err instanceof CancellationError) return;
            setSearchOngoing(false);
            setError(err);
          },
        });
    } else {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    const sub = searchInput$.current.pipe(debounceTime(300)).subscribe({
      next: (nextSearchString) => {
        cancelOngoingSearch();
        loadSearchResults(nextSearchString);
      },
    });

    return () => {
      sub.unsubscribe();
      cancelOngoingSearch();
    };
  }, []);

  const numSearchObservers = useObservable(
    searchSelectionStore.getCountSubscribers(),
    0
  );

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    searchInput$.current.next(event.target.value);
  };

  const onCardSelected = (card: SelectedSearchResult) => {
    searchSelectionStore.setState(card);
  };

  const getListItemElement = (element: SearchResultList['elements'][0]) => {
    if (numSearchObservers === 0) {
      // TODO make URL react to different current URLs
      const toUrl = '/visualization/graph';
      return (
        <Link key={element.key} to={toUrl}>
          <ListItem button component="a">
            {element.element}
          </ListItem>
        </Link>
      );
    }

    return (
      <ListItem
        key={element.key}
        button
        component="a"
        onClick={() => onCardSelected(element.entity)}
      >
        {element.element}
      </ListItem>
    );
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
                    {searchResults.map((result) => (
                      <li className="listSection" key={result.key}>
                        <ul className="SubList">
                          <ListSubheader>{result.header}</ListSubheader>
                          <LimitListSizeComponent
                            list={result.elements.map((element) =>
                              getListItemElement(element)
                            )}
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
