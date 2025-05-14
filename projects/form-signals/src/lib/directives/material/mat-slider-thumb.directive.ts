import {Directive, effect, forwardRef, HostListener, input} from "@angular/core";
import {FormControl} from "../../models/form-control";
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

    public readonly form = input<FormControl<number>>();

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.writeValue(form());
                this.setDisabledState(form.disabled());
            }
        });
    }

    @HostListener('input')
    public onInput() {
        const form = this.form();

        if (form) {
            form.set(this.value);
        }
    }

}
