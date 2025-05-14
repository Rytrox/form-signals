import {defineConfig} from "cypress";
// @ts-expect-error JS-Imports are any
import coverageWebpack from './cypress/coverage.webpack.js';

export default defineConfig({
    component: {
        devServer: {
            framework: "angular",
            bundler: "webpack",
            webpackConfig: coverageWebpack,
        },
        specPattern: "**/*.cy.ts",
        setupNodeEvents(on, config) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('@cypress/code-coverage/task')(on, config);

            return config;
        },
    },
});
