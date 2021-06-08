/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/* eslint-disable @typescript-eslint/no-var-requires,global-require -- for the inline require statements */

const { startDevServer } = require('@cypress/webpack-dev-server');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  if (config.testingType === 'component') {
    // 1) Load webpackConfig like @cypress/react/plugins/react-scripts
    const webpackConfig =
      require('@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig')(
        config
      );

    // 2) Add code coverage plugin like @cypress/instrument-cra
    // 2.1) Find rules
    const rules = webpackConfig.module.rules.find((rule) => !!rule.oneOf).oneOf;
    // 2.2) Find babel rule
    const babelRule = rules.find((rule) => /babel-loader/.test(rule.loader));
    // 2.3) Add istanbul plugin to enable code coverage
    babelRule.options.plugins.push(require.resolve('babel-plugin-istanbul'));

    // 3) Start dev server like @cypress/react/plugins/react-scripts
    on('dev-server:start', async (options) =>
      startDevServer({ options, webpackConfig })
    );
  }

  require('@cypress/code-coverage/task')(on, config);

  /* eslint-enable */
  return config;
};
