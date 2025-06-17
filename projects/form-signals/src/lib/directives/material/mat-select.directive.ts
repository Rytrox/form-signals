import { Directive, effect, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-select[form]',
    standalone: false
})
export class MatSelectDirective<T> extends AbstractFormDirective<T | null | T[]> {

    public readonly form = input<FormControl<T> | FormControl<T | null> | FormControl<T[]>>();

    private readonly element = inject(MatSelect);

    constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.writeValue(form());
                this.element.setDisabledState(form.disabled());
            }
        });
    }

    @HostListener('selectionChange', ['$event'])
    public onChange(event: MatSelectChange<T | T[]>) {
        const form = this.form();

        if (form) {
            if (this.isArrayForm(form)) {
                const arr = Array.isArray(event.value) ? event.value : [event.value];

                form.set(arr);
            } else {
                form.set(event.value as T);
            }
        }
    }

    private isArrayForm(_form: FormControl<T> | FormControl<T | null> | FormControl<T[]>): _form is FormControl<T[]> {
        return this.element.multiple;
    }
}
