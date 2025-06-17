import { Directive, effect, input, OnDestroy, inject } from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {MatDatepickerInput} from "@angular/material/datepicker";
import {FormControl} from "../../models/form-control";
import {Subscription} from "rxjs";

@Directive({
    selector: 'input[matDatepicker][form]',
    standalone: false
})
export class MatDatepickerDirective<D> extends AbstractFormDirective<D | null> implements OnDestroy {

    public readonly form = input<FormControl<D | null>>();

    private readonly datePicker = inject<MatDatepickerInput<D | null>>(MatDatepickerInput);
    private readonly subscription = new Subscription();

    public constructor() {
        super();

        effect(() => {
            const form = this.form();

            if (form) {
                this.datePicker.writeValue(form());
                this.datePicker.setDisabledState(form.disabled());
            }
        });

        this.subscription.add(
            this.datePicker.dateChange.subscribe(date => {
                const form = this.form();

                if (form) {
                    this.updateValue(form, date.value);
                }
            })
        );
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
