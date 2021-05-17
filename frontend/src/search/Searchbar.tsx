import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SearchResultOption } from './SearchResultOption';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  searchbar: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
  searchbarWrapper: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
}));

export default function Searchbar() {
  const classes = useStyles();
  const [value, setValue] = React.useState<SearchResultOption | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<SearchResultOption[]>([]);

  /* const searchService = useService(SearchService, null);

  const executeSearch = React.useMemo(
    () => (input: string, searchService: SearchService) => {
      // Service call here
    },
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    executeSearch(inputValue)
      .then((response) => response.blob())
      .then((result) => {
        if (active) {
          console.log(result);
          const resultOptions = [] as SearchResultOption[]; // convertSearchResultToOptions(result as SearchResult);
          let newOptions = [] as SearchResultOption[];

          if (value) {
            newOptions = [value];
          }

          if (resultOptions) {
            newOptions = [...newOptions, ...resultOptions];
          }

          setOptions(newOptions);
        }
      });

    return () => {
      active = false;
    };
  }, [value, inputValue, executeSearch]); */

  return (
    <Autocomplete
      id="search-autocomplete"
      style={{ width: 350 }}
      getOptionLabel={(option) => option.label}
      filterOptions={(x) => x}
      groupBy={(option) => option.type}
      options={options}
      autoComplete
      size="small"
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event: any, newValue: SearchResultOption | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <TextField
          {...params}
          className={classes.searchbar}
          label="Search"
          variant="filled"
          placeholder="Nodes, Edges, Entities,..."
          fullWidth
        />
      )}
      renderOption={(option) => (
        <Grid container alignItems="center">
          <Grid item>Ph</Grid>
          <Grid item xs>
            <span>{option.label}</span>
            <Typography variant="body2" color="textSecondary">
              {option.subLabel}
            </Typography>
          </Grid>
        </Grid>
      )}
    />
  );
}
