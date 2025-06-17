import { Directive, effect, HostListener, input, inject } from '@angular/core';
import {MatCheckbox} from "@angular/material/checkbox";
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-checkbox[form]',
    standalone: false
})
export class MatCheckboxDirective extends AbstractFormDirective<boolean> {

    public readonly form = input<FormControl<boolean>>();

    private readonly element = inject(MatCheckbox, { self: true });

    public constructor() {
        super();

        // Update input when form value is updated
        effect(() => {
            const form = this.form();

            if (form) {
                this.element.writeValue(form());
                this.element.setDisabledState(form.disabled());
            }
        });
    }

    @HostListener('input')
    public onValueChange() {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.checked);
        }
    }
}
