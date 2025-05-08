import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('InputCheckboxDirective', () => {

    const form = formControl(true);


    beforeEach(() => {
        cy.mount(`<input type="checkbox" [form]="form" />`, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    });

    it('should be checked by default', () => {
        cy.get('input').should('have.prop', 'checked', true);
    });

    it('should uncheck when input is clicked', () => {
        cy.get('input').uncheck();
        cy.get('input').should('have.prop', 'checked', false);

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.false');
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
});
