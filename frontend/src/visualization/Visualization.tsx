import { Box, Container, Grid } from '@material-ui/core';
import React from 'react';
import routes from '../routing/routes';
import DashboardCard from './dashboard-card/DashboardCard';
import createCard from './dashboard-card/cardContents';
import CardDefinition from './dashboard-card/CardDefinition';

function Visualization(): JSX.Element {
  const { tabs } = routes.Visualization;

  if (tabs === undefined) {
    return <></>;
  }

  const cards = tabs.map((tab) => createCard(tab));

  // TODO: remove placeholder grids and fill cards with existing tabs
  const schemaCard = cards[cards.length - 1];
  const placeholders = Array<CardDefinition>(4).fill(schemaCard);

  return (
    <>
      <h1>Visualization Dashboard</h1>
      <Box>
        <Container maxWidth={false}>
          <Box>
            <Grid container spacing={3}>
              {cards.map((card) => (
                <Grid item key={card.label} lg={4} md={6} xs={12}>
                  <DashboardCard
                    label={card.label}
                    path={card.path}
                    content={card.content}
                    description={card.description}
                    subLabel={card.subLabel}
                    icon={card.icon}
                  />
                </Grid>
              ))}
              {placeholders.map((placeholder) => (
                <Grid item key={placeholder.label} lg={4} md={6} xs={12}>
                  <DashboardCard
                    label={placeholder.label}
                    path={placeholder.path}
                    content={placeholder.content}
                    description={placeholder.description}
                    subLabel={placeholder.subLabel}
                    icon={placeholder.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box />
        </Container>
      </Box>
    </>
  );
}

export default Visualization;
