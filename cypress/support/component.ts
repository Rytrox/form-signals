// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import {mount, MountConfig, MountResponse} from 'cypress/angular'
import {Type} from "@angular/core";

import '@cypress/code-coverage/support';

Cypress.on('window:before:load', (win: any) => {
    win.__coverage__ = win.__coverage__ || {};
});


// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount<T>(component: Type<T> | string, config?: MountConfig<T>): Cypress.Chainable<MountResponse<T>>;
    }
  }
}

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(MyComponent)
