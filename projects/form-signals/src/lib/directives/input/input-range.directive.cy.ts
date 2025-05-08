import {FormsModule} from "../../forms.module";
import {formControl} from "../../models/form-control";

describe('InputRangeDirective', () => {

    const form = formControl(50);

    const setup = () => {
        cy.mount(`<input type="range" [form]="form">`, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    };

    beforeEach(() => {
        setup();
    })

    it('should have default value 50', () => {
        cy.get('input').should('have.value', 50);
    });

    it('should change value in form', () => {
        cy.get('input')
            .invoke('val', 75)
            .trigger('input');
        cy.get('input').should('have.value', 75);

        cy.wait(1).then(() => {
            cy.wrap(form()).should('equal', 75);
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
