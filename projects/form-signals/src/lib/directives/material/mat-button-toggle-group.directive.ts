import {Directive, effect, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'mat-button-toggle-group[form]',
    standalone: false
})
export class MatButtonToggleGroupDirective<T> extends AbstractFormDirective<T> {

    public readonly form = input.required<FormControl<T> | FormControl<T[]>>();

    public constructor(readonly element: MatButtonToggleGroup) {
        super();

        effect(() => {
            const form = this.form();

            element.writeValue(form());
        });
    }

    @HostListener('change', ['$event'])
    public onChange(event: MatButtonToggleChange): void {
        const form = this.form();

        form.set(event.value);
    }

}
