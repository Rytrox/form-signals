import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('InputNumberDirective', () => {

    const form = formControl(2);

    const setup = (): void => {
        cy.mount('<input type="number" [form]="form">', {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    }

    beforeEach(() => {
        setup();
    });

    afterEach(() => {
        form.set(2);
    })

    it('should have default value 2', () => {
        cy.get('input').should('have.value', 2);
    });

    it('should write value', () => {
        cy.get('input').clear();
        cy.get('input').type('123');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 123);
        });
    });

    it('should increase value by arrows', () => {
        cy.get('input').type('{upArrow}');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 3);
        });
    });

    it('should decrease value by arrows', () => {
        cy.get('input').type('{downArrow}');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 1);
        })
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
