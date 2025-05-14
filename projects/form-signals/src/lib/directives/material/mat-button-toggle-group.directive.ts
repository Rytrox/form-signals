import {Directive, effect, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-button-toggle-group[form]',
    standalone: false
})
export class MatButtonToggleGroupDirective<T> extends AbstractFormDirective<T | T[]> {

    public readonly form = input<FormControl<T> | FormControl<T[]>>();

    public constructor(readonly element: MatButtonToggleGroup) {
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
    public onChange(event: MatButtonToggleChange): void {
        const form = this.form();

        if (form) {
            form.set(event.value);
        }
    }

}
