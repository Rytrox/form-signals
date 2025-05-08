import {Directive, effect, HostListener, input, Self} from '@angular/core';
import {MatCheckbox} from "@angular/material/checkbox";
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-checkbox[form]',
    standalone: false
})
export class MatCheckboxDirective extends AbstractFormDirective<boolean> {

    public readonly form = input.required<FormControl<boolean>>();

    public constructor(
        @Self() private readonly element: MatCheckbox,
    ) {
        super();

        // Update input when form value is updated
        effect(() => {
            const form = this.form();

            element.writeValue(form());
            element.setDisabledState(form.disabled());
        });
    }

    @HostListener('input')
    public onValueChange() {
        const form = this.form();

        this.updateValue(form, this.element.checked);
    }
}
