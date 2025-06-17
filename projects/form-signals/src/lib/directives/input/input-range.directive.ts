import { Directive, effect, ElementRef, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'input[type=range][form]',
    standalone: false
})
export class InputRangeDirective extends AbstractFormDirective<number> {

    public readonly form = input<FormControl<number>>();

    private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.valueAsNumber = form();
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('input')
    public onInput() {
        const form = this.form();
        if (form) {
            this.updateValue(form, this.element.nativeElement.valueAsNumber);
        }
    }

}
