import {formControl} from "../../form-control";
import {FormsModule} from "../../forms.module";

describe('InputDateDirective', () => {

    const form = formControl<Date | null>(new Date());

    const setupDateEnvironment = (type: 'date' | 'datetime-local' | 'time') => {
        cy.mount(`<input type="${type}" [form]="form" />`, {
            componentProperties: {
                form: form
            },
            imports: [
                FormsModule
            ]
        });
    }

    afterEach(() => {
        form.set(new Date());
    })

    context('Date-Input', () => {
        beforeEach(() => {
            setupDateEnvironment('date');
        });

        it('should have initial value in date', () => {
            cy.get('input[type="date"]').should('have.value', form()!.toISOString().split('T')[0]);
        });

        it('should clear input to null', () => {
            cy.get('input[type="date"]').clear();
            cy.get('input[type="date"]').should('have.value', '');

            cy.wait(1).then(() => {
                cy.wrap(form()).should('be.null');
            });
        });

        it('should set value on input', () => {
            cy.get('input[type="date"]').clear();
            cy.get('input[type="date"]').type('2020-01-01');
            cy.get('input[type="date"]').should('have.value', '2020-01-01');
            cy.wait(1).then(() => {
                cy.wrap(form()).should('be.lte', new Date(Date.UTC(2020, 0, 1)));
            });
        });
    });

    context('Time-Input', () => {
        beforeEach(() => {
            setupDateEnvironment('time');
        });

        it('should have initial value in time', () => {
            cy.get('input[type="time"]').should('have.value', form()!.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3,
                hour12: false,
                timeZone: 'UTC'
            }));
        });

        it('should clear input to null', () => {
            setupDateEnvironment('time');

            cy.get('input[type="time"]').clear();
            cy.get('input[type="time"]').should('have.value', '');
            cy.wait(1).then(() => {
                cy.wrap(form()).should('be.null');
            });
        });

        it('should set value on input', () => {
            cy.get('input[type="time"]').clear();
            const input = new Date(Date.UTC(2020, 0, 1, 12, 30, 22)).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'UTC'
            });
            cy.get('input[type="time"]').type(input);
            cy.get('input[type="time"]').should('have.value', input);
            cy.wait(1).then(() => {
                cy.wrap(form()).should('be.lte', new Date(Date.UTC(1970, 0, 1, 12, 30, 22)));
            });
        })
    });
});
