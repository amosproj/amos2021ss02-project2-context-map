import React from 'react';
import List from '@material-ui/core/List';
import HomeIcon from '@material-ui/icons/Home';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import StreetviewIcon from '@material-ui/icons/Streetview';
import ExploreIcon from '@material-ui/icons/Explore';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import ListItemLink from './routing/ListItemLink';

function MainMenu(): JSX.Element {
  return (
    <List>
      <ListItemLink primary="Home" to="/home" icon={<HomeIcon />} />
      <ListItemLink
        primary="Visualization"
        to="/visualization"
        icon={<ViewCompactIcon />}
      />
      <ListItemLink
        primary="Exploration"
        to="/exploration"
        icon={<ExploreIcon />}
      />
      <ListItemLink primary="Data" to="/data" icon={<BubbleChartIcon />} />
      <ListItemLink
        primary="Archetypes"
        to="/archetypes"
        icon={<StreetviewIcon />}
      />
    </List>
  );
}

export default MainMenu;
