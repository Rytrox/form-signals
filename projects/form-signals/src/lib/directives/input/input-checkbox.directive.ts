import { Directive, effect, ElementRef, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'input[type=checkbox][form]',
    standalone: false
})
export class InputCheckboxDirective extends AbstractFormDirective<boolean> {

    public readonly form = input<FormControl<boolean>>();

    private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.checked = form();
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('input')
    public onChange() {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.nativeElement.checked);
        }
    }
}
