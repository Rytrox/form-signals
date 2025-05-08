import {formControl} from "../../models/form-control";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "../../forms.module";
import {provideNativeDateAdapter} from "@angular/material/core";

describe('MatDatepickerDirective', () => {

    const form = formControl<Date | null>(new Date());

    beforeEach(() => {
        cy.mount(`
            <mat-form-field>
                <input matInput [matDatepicker]="picker" [form]="form">
                <mat-datepicker-toggle matIconSuffix [for]="picker" />
                <mat-datepicker #picker />
            </mat-form-field>
        `, {
            componentProperties: {
                form: form
            },
            imports: [
                MatDatepickerModule,
                MatFormFieldModule,
                MatInputModule,
                FormsModule
            ],
            providers: [
                provideNativeDateAdapter()
            ]
        });
    });

    it('should have value in input', () => {
        cy.get('input').should('have.value', form()!.toLocaleDateString('en-US'));
    });

    it('should not update date in input on type without blur', () => {
        const before = form();

        cy.get('input').type('{backspace}{backspace}{backspace}{backspace}{backspace}');
        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', before);
        });
    });

    it('should set value to null when input is cleared', () => {
        cy.get('input').clear();
        cy.get('input').blur();

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.null');
        });
    });

    it('should set value when input is changed', () => {
        cy.get('input').clear()
        cy.get('input').type('4/1/2023');
        cy.get('input').blur();

        cy.wait(1).then(() => {
            cy.wrap(form()).should('be.lte', new Date(Date.UTC(2023, 3, 1)));
        });
    });

    it('should select via Datepicker', () => {
        cy.get('mat-datepicker-toggle').click();
        cy.get('mat-calendar')
            .find('button.mat-calendar-body-cell')
            .eq(15)
            .click();

        cy.wait(1).then(() => {
            cy.get('input').should('have.value', form()!.toLocaleDateString('en-US'));
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
