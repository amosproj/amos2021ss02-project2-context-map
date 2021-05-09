import React from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import StreetviewIcon from '@material-ui/icons/Streetview';
import ExploreIcon from '@material-ui/icons/Explore';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  // TODO: Fix this, so that the rule does not have to be disabled
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

function MainMenu(): JSX.Element {
  return (
    <List>
      <ListItemLink key="Home" href="/">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemLink>

      <ListItemLink key="Visualization" href="/">
        <ListItemIcon>
          <ViewCompactIcon />
        </ListItemIcon>
        <ListItemText primary="Visualization" />
      </ListItemLink>

      <ListItemLink key="Exploration" href="/">
        <ListItemIcon>
          <ExploreIcon />
        </ListItemIcon>
        <ListItemText primary="Exploration" />
      </ListItemLink>

      <ListItemLink key="Data" href="/">
        <ListItemIcon>
          <BubbleChartIcon />
        </ListItemIcon>
        <ListItemText primary="Data" />
      </ListItemLink>

      <ListItemLink key="Archetypes" href="/">
        <ListItemIcon>
          <StreetviewIcon />
        </ListItemIcon>
        <ListItemText primary="Archetypes" />
      </ListItemLink>
    </List>
  );
}

export default MainMenu;
