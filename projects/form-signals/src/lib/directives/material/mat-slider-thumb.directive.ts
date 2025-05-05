import {Directive, effect, forwardRef, HostListener, input} from "@angular/core";
import {FormControl} from "../../form-control";
import {MatSliderThumb} from "@angular/material/slider";

@Directive({
    selector: 'input[matSliderThumb][form]',
    providers: [
        {
            provide: MatSliderThumb,
            useExisting: forwardRef(() => MatSliderThumbDirective),
        }
    ],
    standalone: false
})
export class MatSliderThumbDirective extends MatSliderThumb {

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
