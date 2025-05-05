import {mount} from "cypress/angular";
import {MatSliderModule} from "@angular/material/slider";
import {formControl} from "../../form-control";
import {FormsModule} from "../../forms.module";

describe('MatSliderRangeThumbDirective', () => {

    const startForm = formControl(10);
    const endForm = formControl(90);

    beforeEach(() => {
        mount(`
            <mat-slider>
                <input matSliderStartThumb [form]="startForm">
                <input matSliderEndThumb [form]="endForm">
            </mat-slider>
        `, {
            componentProperties: {
                startForm: startForm,
                endForm: endForm,
            },
            imports: [
                FormsModule,
                MatSliderModule
            ]
        });
    });

    it('should have default values by formControl', () => {
        cy.get('input').eq(0)
            .should('have.value', 10);
        cy.get('input').eq(1)
            .should('have.value', 90);
    });

    it('should update min value', () => {
        cy.get('input').eq(0)
            .invoke('val', 40)
            .trigger('input');

        cy.wait(1).then(() => {
            cy.wrap(startForm()).should('eq', 40);
        });
    });

    it('should update max value', () => {
        cy.get('input').eq(1)
            .invoke('val', 60)
            .trigger('input');

        cy.wait(1).then(() => {
            cy.wrap(endForm()).should('eq', 60);
        });
    });
});
