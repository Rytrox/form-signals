import {Directive, effect, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-select[form]',
    standalone: false
})
export class MatSelectDirective<T> extends AbstractFormDirective<T | T[]> {

    public readonly form = input.required<FormControl<T> | FormControl<T | null> | FormControl<T[]>>();

    constructor(private readonly element: MatSelect) {
        super();

        effect(() => {
            const form = this.form();

            element.writeValue(form());
            element.setDisabledState(form.disabled());
        });
    }

    @HostListener('selectionChange', ['$event'])
    public onChange(event: MatSelectChange<T | T[]>) {
        const form = this.form();

        if (this.isArrayForm(form)) {
            const arr = Array.isArray(event.value) ? event.value : [ event.value ];

            form.set(arr);
        } else {
            form.set(event.value as T);
        }
    }

    private isArrayForm(form: FormControl<T> | FormControl<T | null> | FormControl<T[]>): form is FormControl<T[]> {
        return this.element.multiple;
    }
}
