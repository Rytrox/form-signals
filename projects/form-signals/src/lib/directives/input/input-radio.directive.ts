import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'input[type=radio][form]',
    standalone: false
})
export class InputRadioDirective extends AbstractFormDirective<string> {

    public readonly form = input.required<FormControl<string>>();


    constructor(private element: ElementRef<HTMLInputElement>) {
        super();

        effect(() => {
            const form = this.form();

            this.element.nativeElement.checked = form() === this.element.nativeElement.value;
        });
    }

    @HostListener('change')
    public onClick(): void {
        const checked = this.element.nativeElement.checked;

        if (checked) {
            this.updateValue(this.form(), this.element.nativeElement.value);
        }
    }

}
