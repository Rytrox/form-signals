import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {formControl} from "../../form-control";
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

describe('MatButtonToggleGroupDirective', () => {

    context('Single Toggle Select', () => {
        const form = formControl<Developer>(developers[1]);

        beforeEach(() => {
            cy.mount(`
            <mat-button-toggle-group [form]="form">
                @for (developer of developers; track developer.id) {
                    <mat-button-toggle [value]="developer">{{developer.name}}</mat-button-toggle>
                }
            </mat-button-toggle-group>
        `, {
                componentProperties: {
                    form: form,
                    developers: developers
                },
                imports: [
                    MatButtonToggleModule,
                    FormsModule
                ]
            });
        });

        beforeEach(() => {
            form.set(developers[1]);
        })

        it('should select correct button by default', () => {
            cy.get('mat-button-toggle')
                .eq(0)
                .find('mat-pseudo-checkbox')
                .should('not.be.visible');

            cy.get('mat-button-toggle')
                .eq(1)
                .find('mat-pseudo-checkbox')
                .should('be.visible');

            cy.get('mat-button-toggle')
                .eq(2)
                .find('mat-pseudo-checkbox')
                .should('not.be.visible');
        });

        it('should update value on select', () => {
            cy.get('mat-button-toggle')
                .eq(0)
                .click();

            cy.get('mat-button-toggle')
                .eq(1)
                .find('mat-pseudo-checkbox')
                .should('not.be.visible');
            cy.get('mat-button-toggle')
                .eq(0)
                .find('mat-pseudo-checkbox')
                .should('be.visible');

            cy.wait(1).then(() => {
                cy.wrap(form()).should('eq', developers[0]);
            })
        });
    });

    context('Multiple Toggle Select', () => {

        const form = formControl<Developer[]>(developers);

        beforeEach(() => {
            cy.mount(`
            <mat-button-toggle-group [form]="form" multiple>
                @for (developer of developers; track developer.id) {
                    <mat-button-toggle [value]="developer">{{developer.name}}</mat-button-toggle>
                }
            </mat-button-toggle-group>
        `, {
                componentProperties: {
                    form: form,
                    developers: developers
                },
                imports: [
                    MatButtonToggleModule,
                    FormsModule
                ]
            });
        });

        it('should have selected all values by default', () => {
            cy.get('mat-button-toggle')
                .each(toggle => {
                    cy.wrap(toggle)
                        .find('mat-pseudo-checkbox')
                        .should('be.visible');
                });
        })

        it('should unselect correct buttons', () => {
            cy.get('mat-button-toggle')
                .eq(0)
                .click();
            cy.get('mat-button-toggle')
                .eq(0)
                .find('mat-pseudo-checkbox')
                .should('not.be.visible');

            cy.wait(1).then(() => {
                const values = form();

                cy.wrap(values).should('have.length', 2)
                    .and('include', developers[1])
                    .and('include', developers[2])
                    .and('not.include', developers[0]);
            })
        });
    })
});
