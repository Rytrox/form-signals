import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "../../forms.module";
import {formControl} from "../../form-control";

describe('MatSlideToggleDirective', () => {

    const form = formControl(true);

    beforeEach(() => {
        cy.mount('<mat-slide-toggle [form]="form">Slider</mat-slide-toggle>', {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule,
                MatSlideToggleModule
            ]
        });
    });

    it('should be enabled by default', () => {
        cy.get('mat-slide-toggle').should('have.class', 'mat-mdc-slide-toggle-checked');
    });

    it('should uncheck slide on click', () => {
        cy.get('mat-slide-toggle').click();
        cy.get('mat-slide-toggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.false');
        });
    });
});
