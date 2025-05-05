import {formControl} from "../../form-control";
import {FormsModule} from "../../forms.module";

describe('InputFileDirective', () => {

    context('Single File Input', () => {
        const form = formControl<File | null>(null);

        beforeEach(() => {
            cy.mount(`<input type="file" [form]="form" />`, {
                componentProperties: {
                    form: form
                },
                imports: [
                    FormsModule
                ]
            });
        });

        it('should have selected no file', () => {
            cy.get('input[type="file"]').should('have.prop', 'files');
            cy.get('input[type="file"]').then(input => {
                const inputFile = (input[0] as HTMLInputElement).files;

                cy.wrap(inputFile!.length).should('eq', 0);
            });
        });

        it('should select file', () => {
            cy.get('input[type="file"]').selectFile({
                contents: Cypress.Buffer.from('file content'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf',
                lastModified: Date.now()
            });

            cy.wait(1).then(() => {
                cy.get('input[type="file"]').then(input => {
                    const inputFile = (input[0] as HTMLInputElement).files;

                    cy.wrap(inputFile!.length).should('eq', 1);
                });
            });
        });
    });

    context('Multiple File Input', () => {
        const form = formControl<File[] | null>(null);

        beforeEach(() => {
            cy.mount(`<input type="file" multiple [form]="form" />`, {
                componentProperties: {
                    form: form
                },
                imports: [
                    FormsModule
                ]
            });
        });

        it('should have selected no file', () => {
            cy.get('input[type="file"]').should('have.prop', 'files');
            cy.get('input[type="file"]').then(input => {
                const inputFile = (input[0] as HTMLInputElement).files;

                cy.wrap(inputFile!.length).should('eq', 0);
            });
        });

        it('should select files', () => {
            cy.get('input[type="file"]').selectFile([
                {
                    contents: Cypress.Buffer.from('file content #1'),
                    fileName: 'test1.pdf',
                    mimeType: 'application/pdf',
                    lastModified: Date.now()
                },
                {
                    contents: Cypress.Buffer.from('file content #2'),
                    fileName: 'test2.pdf',
                    mimeType: 'application/pdf',
                    lastModified: Date.now() - 12
                }
            ]);

            cy.get('input[type="file"]').then(input => {
                const inputFile = (input[0] as HTMLInputElement).files;

                cy.wrap(inputFile!.length).should('eq', 2);
                cy.wait(1).then(() => {
                    const value = form();

                    cy.wrap(value).should('not.be.null');
                    cy.wrap(value).should('have.length', 2);
                });
            });
        });
    })
});
