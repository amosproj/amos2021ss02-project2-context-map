import { Box, Container, Grid } from '@material-ui/core';
import React from 'react';
import routes from '../routing/routes';
import DashboardCard from './dashboard-card/DashboardCard';
import createCard from './dashboard-card/cardContents';

function Visualization(): JSX.Element {
  const { tabs } = routes.Visualization;

  if (tabs === undefined) {
    throw new Error('Cannot read Visualization tabs');
    return <></>;
  }

  const cards = tabs.map((tab) => createCard(tab));

  return (
    <Box>
      <Container maxWidth={false}>
        <h1>Visualization Dashboard</h1>
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
          </Grid>
        </Box>
        <Box />
      </Container>
    </Box>
  );
}

export default Visualization;
