import { Box, Container, Grid } from '@material-ui/core';
import React from 'react';
import routes from '../routing/routes';
import DashboardCard from './DashboardCard';

function Visualization(): JSX.Element {
  const { tabs } = routes.Visualization;

  if (tabs === undefined) {
    throw new Error('Cannot read Visualization tabs');
    return <></>;
  }
  return (
    <>
      <h1>Visualization Dashboard</h1>
      <Box>
        <Container maxWidth={false}>
          <Box>
            <Grid container spacing={3}>
              {tabs.map((tab) => (
                <Grid item key={tab.label} lg={4} md={6} xs={12}>
                  <a href={tab.path}>
                    <DashboardCard
                      path={tab.path}
                      label={tab.label}
                      content={tab.content}
                      exact={tab.exact}
                    />
                  </a>
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
