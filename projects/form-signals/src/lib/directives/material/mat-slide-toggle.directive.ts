import {Directive, effect, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'mat-slide-toggle[form]',
    standalone: false
})
export class MatSlideToggleDirective extends AbstractFormDirective<boolean> {

    public readonly form = input<FormControl<boolean>>();

    public constructor(private element: MatSlideToggle) {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                element.writeValue(form());
                element.setDisabledState(form.disabled());
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
