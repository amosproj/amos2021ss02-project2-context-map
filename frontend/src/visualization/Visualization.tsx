import { Box, Container, Grid } from '@material-ui/core';
import React from 'react';
import routes from '../routing/routes';
import DashboardCard from './dashboard-card/DashboardCard';
import cardContents from './dashboard-card/cardContents';

function Visualization(): JSX.Element {
  const { tabs } = routes.Visualization;

  /* istanbul ignore if */
  if (tabs === undefined) {
    return <></>;
  }

  const cards = cardContents;

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
    </>
  );
}

export default Visualization;
