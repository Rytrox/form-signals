import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'input[type=range][form]',
    standalone: false
})
export class InputRangeDirective extends AbstractFormDirective<number> {

    public readonly form = input.required<FormControl<number>>();

    public constructor(private readonly element: ElementRef<HTMLInputElement>) {
        super();

        effect(() => {
            const form = this.form();

            this.element.nativeElement.valueAsNumber = form();
        });
    }

    @HostListener('input')
    public onInput() {
        const form = this.form();

        this.updateValue(form, this.element.nativeElement.valueAsNumber);
    }

}
