import {MatSliderModule} from "@angular/material/slider";
import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

describe('MatSliderThumbDirective', () => {

    const form = formControl(10);

    beforeEach(() => {
        cy.mount(`
            <mat-slider>
                <input matSliderThumb [form]="form">
            </mat-slider>
        `, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule,
                MatSliderModule
            ]
        });
    });

    it('should set default value', () => {
        cy.get('input').should('have.value', 10);
    });

    it('should set value', () => {
        cy.get('input')
            .invoke('val', 20)
            .trigger('input');

        cy.get('input').should('have.value', 20);
        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', 20);
        });
    });

    it('should disable thumb when form is disabled', () => {
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
