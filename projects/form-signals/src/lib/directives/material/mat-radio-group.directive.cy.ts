import {MatRadioModule} from "@angular/material/radio";
import {formControl} from "../../models/form-control";
import {FormsModule} from "../../forms.module";

interface Developer {
    id: number;
    name: string;
}

const developers: Developer[] = [
    {
        id: 1,
        name: 'Timeout',
    },
    {
        id: 2,
        name: 'Sether',
    },
    {
        id: 3,
        name: 'Asedem'
    }
];

describe('MatRadioGroupDirective', () => {

    const form = formControl(developers[0]);

    beforeEach(() => {
        cy.mount(`
            <mat-radio-group [form]="form">
                @for (developer of developers; track developer.id) {
                    <mat-radio-button [value]="developer">{{developer.name}}</mat-radio-button>
                }
            </mat-radio-group>
        `, {
            componentProperties: {
                form: form,
                developers: developers
            },
            imports: [
                FormsModule,
                MatRadioModule
            ]
        });
    });

    it('should have correct value selected by default', () => {
        cy.get('mat-radio-button')
            .eq(0)
            .should('have.class', 'mat-mdc-radio-checked');

        cy.get('mat-radio-button')
            .eq(1)
            .should('not.have.class', 'mat-mdc-radio-checked');

        cy.get('mat-radio-button')
            .eq(2)
            .should('not.have.class', 'mat-mdc-radio-checked');
    });

    it('should select value and change form value', () => {
        cy.get('mat-radio-button')
            .eq(1)
            .click();

        cy.get('mat-radio-button')
            .eq(0)
            .should('not.have.class', 'mat-mdc-radio-checked');
        cy.get('mat-radio-button')
            .eq(1)
            .should('have.class', 'mat-mdc-radio-checked');
        cy.get('mat-radio-button')
            .eq(2)
            .should('not.have.class', 'mat-mdc-radio-checked');
        cy.wait(1).then(() => {
            cy.wrap(form()).should('eq', developers[1]);
        });
    });

    it('should disable when form is disabled', () => {
        cy.get('mat-radio-button').each(button => cy.wrap(button).should('not.have.class', 'mat-mdc-radio-disabled'));

        form.disabled.set(true);
        cy.wait(1).then(() => {
            cy.get('mat-radio-button').each(button => cy.wrap(button).should('have.class', 'mat-mdc-radio-disabled'))
            form.disabled.set(false);

            cy.wait(1).then(() => {
                cy.get('mat-radio-button').each(button => cy.wrap(button).should('not.have.class', 'mat-mdc-radio-disabled'));
            });
        });
    });
});
