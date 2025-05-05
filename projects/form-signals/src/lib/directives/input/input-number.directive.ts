import {Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'input[type=number][form]',
    standalone: false
})
export class InputNumberDirective extends AbstractFormDirective<number> {

    public readonly form = input.required<FormControl<number>>();

    public constructor(
        private readonly element: ElementRef<HTMLInputElement>,
    ) {
        super();

        // Update input when form value is updated
        effect(() => {
            const form = this.form();

            element.nativeElement.valueAsNumber = form();
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
        this.updateValue(this.form(), this.element.nativeElement.valueAsNumber);
    }

}
