import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('InputTextDirective', () => {

    const form = formControl('Hello');

    const setup = () => {
        cy.mount(`<input [form]="form">`, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        })
    };

    beforeEach(() => {
        setup();
    });

    afterEach(() => {
        form.set('Hello');
    })

    it('should have default value of "Hello"', () => {
        cy.get('input').should('have.value', 'Hello');
    });

    it('should set value to empty string when input is cleared', () => {
        cy.get('input').clear();
        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', '');
        });
    });

    it('should change value when input changes', () => {
        cy.get('input').clear();
        cy.get('input').type('Changed!');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 'Changed!');
        });
    });

    it('should disable when form is disabled', () => {
        cy.get('input').should('be.enabled');

        form.disabled.set(true);
        cy.wait(1).then(() => {
            cy.get('input').should('be.disabled');

            form.disabled.set(false);
            cy.wait(1).then(() => {
                cy.get('input').should('be.enabled');
            });
        });
    });
})
