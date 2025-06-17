import { Directive, effect, ElementRef, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'input[type=date][form], input[type=datetime-local][form], input[type=time][form]',
    standalone: false
})
export class InputDateDirective extends AbstractFormDirective<Date | null> {

    public readonly form = input<FormControl<Date | null>>();

    private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.valueAsDate = form();
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('input')
    protected onInput(): void {
        const form = this.form();

        if (form) {
            super.updateValue(form, this.element.nativeElement.valueAsDate);
        }
    }

}
