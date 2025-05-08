import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('InputRadioDirective', () => {

    const form = formControl('Hello');

    const setup = () => {
        cy.mount(`
            <input type="radio" value="Hello" [form]="form">
            <input type="radio" value="World" [form]="form">
            <input type="radio" value="!" [form]="form">
        `, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    }

    beforeEach(() => {
        setup()
    });

    it('should select correct radio-button', () => {
        cy.get('input').eq(0).should('be.checked');
        cy.get('input').eq(1).should('not.be.checked');
        cy.get('input').eq(2).should('not.be.checked');
    });

    it('should change value in radio-button', () => {
        cy.get('input').eq(1).check();
        cy.get('input').eq(0).should('not.be.checked');
        cy.get('input').eq(1).should('be.checked');
        cy.get('input').eq(2).should('not.be.checked');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 'World');

            cy.get('input').eq(2).check();
            cy.get('input').eq(0).should('not.be.checked');
            cy.get('input').eq(1).should('not.be.checked');
            cy.get('input').eq(2).should('be.checked');

            cy.wait(1).then(() => {
                cy.wrap(form()).should('eq', '!');
            })
        });
    });

    it('should disable when form is disabled', () => {
        cy.get('input').each(input => cy.wrap(input).should('be.enabled'));

        form.disabled.set(true);
        cy.wait(1).then(() => {
            cy.get('input').each(input => cy.wrap(input).should('be.disabled'));

            form.disabled.set(false);
            cy.wait(1).then(() => {
                cy.get('input').each(input => cy.wrap(input).should('be.enabled'));
            });
        });
    });
});
