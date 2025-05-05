import {Directive, effect, forwardRef, HostListener, input} from '@angular/core';
import {MatSliderRangeThumb} from "@angular/material/slider";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'input[matSliderStartThumb][form], input[matSliderEndThumb][form]',
    providers: [
        {
            provide: MatSliderRangeThumb,
            useExisting: forwardRef(() => MatSliderRangeThumbDirective),
        }
    ],
    standalone: false
})
export class MatSliderRangeThumbDirective extends MatSliderRangeThumb {

    public readonly form = input.required<FormControl<number>>();

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            this.writeValue(form());
        });
    }

    @HostListener('input')
    public onInput() {
        const form = this.form();

        form.set(this.value);
    }
}
