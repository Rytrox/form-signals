import {formControl} from "../../form-control";
import {FormsModule} from "../../forms.module";

describe('SelectDirective', () => {

    const form = formControl('World');

    beforeEach(() => {
        cy.mount(`
            <select [form]="form">
                <option value="Hello">Hello</option>
                <option value="World">World</option>
                <option value="!">!</option>
            </select>
        `, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    });

    it('should have default value', () => {
        cy.get('select').should('have.value', 'World');
    });

    it('should select value', () => {
        cy.get('select').select('Hello');
        cy.get('select').should('have.value', 'Hello');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 'Hello');
        });
    });
});
