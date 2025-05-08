import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
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

describe('MatSelectDirective', () => {

    context('Single Value Select', () => {

        const form = formControl<Developer | null>(null);

        beforeEach(() => {
            cy.mount(`
                <mat-form-field>
                    <mat-select [form]="form">
                        @for (developer of developers; track developer.id) {
                            <mat-option [value]="developer">{{developer.name}}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>
            `, {
                componentProperties: {
                    form: form,
                    developers: developers
                },
                imports: [
                    FormsModule,
                    MatSelectModule,
                    MatFormFieldModule
                ]
            });
        });

        it('should have no value selected', () => {
            cy.get('mat-select')
                .should('have.class', 'mat-mdc-select-empty');
        });

        it('should select value', () => {
            cy.get('mat-select').click();

            cy.get('mat-option').eq(1).click();
            cy.wait(1).then(() => {
                cy.wrap(form()).should('eq', developers[1]);
            });
        });

        it('should disable when form is disabled', () => {
            cy.get('mat-select')
                .should('not.have.class', 'mat-mdc-select-disabled')
                .then(() => {
                    form.disabled.set(true);
                    cy.wait(1).then(() => {
                        cy.get('mat-select')
                            .should('have.class', 'mat-mdc-select-disabled')
                            .then(() => form.disabled.set(false));

                        cy.wait(1).then(() => {
                            cy.get('mat-select')
                                .should('not.have.class', 'mat-mdc-select-disabled');
                        });
                    });
                });
        });
    });

    context('Multiple Value Select', () => {
        const form = formControl(developers);

        beforeEach(() => {
            cy.mount(`
                <mat-form-field>
                    <mat-select [form]="form" multiple>
                        @for (developer of developers; track developer.id) {
                            <mat-option [value]="developer">{{developer.name}}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>
            `, {
                componentProperties: {
                    form: form,
                    developers: developers
                },
                imports: [
                    FormsModule,
                    MatSelectModule,
                    MatFormFieldModule
                ]
            });
        });

        it('should select all values by default', () => {
            cy.get('mat-select').click();
            cy.get('mat-option').each(option => {
                cy.wrap(option)
                    .find('mat-pseudo-checkbox')
                    .should('have.class', 'mat-pseudo-checkbox-checked');
            });
        });

        it('should update selected values', () => {
            cy.get('mat-select').click();
            cy.get('mat-option').eq(0).click();

            cy.get('mat-option')
                .eq(0)
                .find('mat-pseudo-checkbox')
                .should('not.have.class', 'mat-pseudo-checkbox-checked');
            cy.wait(1).then(() => {
                cy.wrap(form()).should('not.include', developers[0])
                    .and('include', developers[1])
                    .and('include', developers[2]);

                cy.get('mat-option').eq(1).click();
                cy.get('mat-option').eq(1)
                    .find('mat-pseudo-checkbox')
                    .should('not.have.class', 'mat-pseudo-checkbox-checked');
                cy.wait(1).then(() => {
                    cy.wrap(form()).should('not.include', developers[0])
                        .and('not.include', developers[1])
                        .and('include', developers[2]);

                    cy.get('mat-option').eq(2).click();
                    cy.wait(1).then(() => {
                        cy.wrap(form()).should('not.include', developers[0])
                            .and('not.include', developers[1])
                            .and('not.include', developers[2])
                            .and('not.be.null');
                    });
                });
            });
        });

        it('should disable when form is disabled', () => {
            cy.get('mat-select')
                .should('not.have.class', 'mat-mdc-select-disabled')
                .then(() => {
                    form.disabled.set(true);
                    cy.wait(1).then(() => {
                        cy.get('mat-select')
                            .should('have.class', 'mat-mdc-select-disabled')
                            .then(() => form.disabled.set(false));

                        cy.wait(1).then(() => {
                            cy.get('mat-select')
                                .should('not.have.class', 'mat-mdc-select-disabled');
                        });
                    });
                });
        });
    });
});
