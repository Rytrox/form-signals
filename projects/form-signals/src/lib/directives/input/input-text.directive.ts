import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'textarea[form], input:not([matDatepicker]):not([matSliderThumb]):not([matSliderStartThumb]):not([matSliderEndThumb]):not([type=number]):not([type=checkbox]):not([type=date]):not([type=datetime-local]):not([type=time]):not([type=radio]):not([type=range]):not([type=file])[form]',
    standalone: false
})
export class InputTextDirective extends AbstractFormDirective<string> {

    public readonly form = input<FormControl<string>>();

    public constructor(
        private readonly element: ElementRef<HTMLInputElement | HTMLTextAreaElement>
    ) {
        super();

        // Update input when form value is updated
        effect(() => {
            const form = this.form();

            if (form) {
                element.nativeElement.value = form();
                element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('input')
    public onInput(): void {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.nativeElement.value);
        }
    }
}
