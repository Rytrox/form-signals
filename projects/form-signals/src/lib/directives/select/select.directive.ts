import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'select[form]',
    standalone: false
})
export class SelectDirective extends AbstractFormDirective<string> {

    public readonly form = input.required<FormControl<string>>();

    public constructor(private readonly element: ElementRef<HTMLSelectElement>) {
        super();

        effect(() => {
            const form = this.form();

            element.nativeElement.value = form();
        });
    }

    @HostListener('change')
    public onChange(): void {
        const form = this.form();

        this.updateValue(form, this.element.nativeElement.value);
    }
}
