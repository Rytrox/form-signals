import {Directive, effect, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatRadioChange, MatRadioGroup} from "@angular/material/radio";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-radio-group[form]',
    standalone: false
})
export class MatRadioGroupDirective<T> extends AbstractFormDirective<T> {

    public readonly form = input<FormControl<T>>();

    public constructor(readonly element: MatRadioGroup) {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                element.writeValue(form());
                element.setDisabledState(form.disabled());
            }
        });
    }

    @HostListener('change', ['$event'])
    public onValueChange(event: MatRadioChange): void {
        const form = this.form();

        if (form) {
            this.updateValue(form, event.value);
        }
    }
}
