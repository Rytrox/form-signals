import { Directive, effect, ElementRef, HostListener, input, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../models/form-control";

@Directive({
    selector: 'input[type=number][form]',
    standalone: false
})
export class InputNumberDirective extends AbstractFormDirective<number> {

    public readonly form = input<FormControl<number>>();

    private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

    public constructor() {
        super();

        // Update input when form value is updated
        effect(() => {
            const form = this.form();

            if (form) {
                this.element.nativeElement.valueAsNumber = form();
                this.element.nativeElement.disabled = form.disabled();
            }
        });
    }

    /**
     * Blocks incoming input that are not numbers
     *
     * @param event
     */
    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        if (event.key.length === 1 && !/[-+.0-9]/.test(event.key)) {
            event.preventDefault();
        }
    }

    @HostListener('input')
    public onInput(): void {
        const form = this.form();

        if (form) {
            this.updateValue(form, this.element.nativeElement.valueAsNumber);
        }
    }

}
