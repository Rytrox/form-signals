import {FormControl} from "../models/form-control";

export class AbstractFormDirective<T> {

    protected updateValue(form: FormControl<T>, value: T): void {
        form.set(value);
    }
}
