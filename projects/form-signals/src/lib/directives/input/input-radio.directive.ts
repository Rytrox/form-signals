import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'input[type=radio][form]',
    standalone: false
})
export class InputRadioDirective extends AbstractFormDirective<string> {

    public readonly form = input<FormControl<string>>();


    constructor(private element: ElementRef<HTMLInputElement>) {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.checked = form() === this.element.nativeElement.value;
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('change')
    public onClick(): void {
        const form = this.form();
        if (form) {
            const checked = this.element.nativeElement.checked;

            if (checked) {
                this.updateValue(form, this.element.nativeElement.value);
            }
        }
    }

}
