import { Box, Container, Grid } from '@material-ui/core';
import React from 'react';
import DashboardCard from './dashboard-card/DashboardCard';
import cardContents from './dashboard-card/cardContents';

function Visualization(): JSX.Element {
  const cards = cardContents;

  return (
    <Box p={3}>
      <h1>Visualization Dashboard</h1>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item key={card.label} lg={4} md={6} xs={12}>
              <DashboardCard
                label={card.label}
                path={card.path}
                description={card.description}
                subLabel={card.subLabel}
                icon={card.icon}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Visualization;
