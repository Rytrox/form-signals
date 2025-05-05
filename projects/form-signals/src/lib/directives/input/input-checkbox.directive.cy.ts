import {formControl} from "../../form-control";
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

    it('should be enabled by default', () => {
        cy.get('input').should('have.prop', 'checked', true);
    });

    it('should set disabled when input is clicked', () => {
        cy.get('input').uncheck();
        cy.get('input').should('have.prop', 'checked', false);

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.false');
        });
    });
});
