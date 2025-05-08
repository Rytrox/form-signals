import {MatCheckboxModule} from "@angular/material/checkbox";
import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('MatCheckboxDirective', () => {

    const form = formControl(true);

    beforeEach(() => {
        cy.mount(`<mat-checkbox [form]="form" />`, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule,
                MatCheckboxModule
            ]
        });
    });

    it('should be selected by default', () => {
        cy.get('mat-checkbox').should('have.class', 'mat-mdc-checkbox-checked');
    });

    it('should disable by click', () => {
        cy.get('mat-checkbox').click();
        cy.get('mat-checkbox').should('not.have.class', 'mat-mdc-checkbox-checked');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.false');
        });
    });

    it('should disable when form is disabled', () => {
        cy.get('mat-checkbox')
            .should('not.have.class', 'mat-mdc-checkbox-disabled')
            .then(() => {
                form.disabled.set(true);
                cy.wait(1).then(() => {
                    cy.get('mat-checkbox')
                        .should('have.class', 'mat-mdc-checkbox-disabled')
                        .then(() => form.disabled.set(false));

                    cy.wait(1).then(() => {
                        cy.get('mat-checkbox')
                            .should('not.have.class', 'mat-mdc-checkbox-disabled');
                    });
                });
            });
    });
});
