import { Directive, effect, ElementRef, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'select[form]',
    standalone: false
})
export class SelectDirective extends AbstractFormDirective<string> {

    public readonly form = input<FormControl<string>>();

    private readonly element = inject<ElementRef<HTMLSelectElement>>(ElementRef);

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.value = form();
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    @HostListener('change')
    public onChange(): void {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.nativeElement.value);
        }
    }
}
