// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // baseUrl: 'http://localhost:8888',
    specPattern: 'cypress/integration/**/*.{js,jsx,ts,tsx}',
    // supportFile: 'support/e2e.ts',  // or set to false
    supportFile: false,
    fixturesFolder: 'cypress/fixtures',
  },
  // component: {
  //   componentFolder: 'component',
  //   specPattern: '**/*.{js,jsx,ts,tsx}',
  //   supportFile: 'support/index.js',
  // },
  env: {
    // Set via command line: cypress run --env apiUrl=http://localhost:8888
    // apiUrl: "http://localhost:8888",
  },
});
