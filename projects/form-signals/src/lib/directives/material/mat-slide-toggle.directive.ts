import { Directive, effect, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-slide-toggle[form]',
    standalone: false
})
export class MatSlideToggleDirective extends AbstractFormDirective<boolean> {

    public readonly form = input<FormControl<boolean>>();

    private readonly element = inject(MatSlideToggle);

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.writeValue(form());
                this.element.setDisabledState(form.disabled());
            }
        });
    }

    @HostListener('change')
    public onChange() {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.checked);
        }
    }
}
