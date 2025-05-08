import {createAbstractForm, Form} from "./form";
import {ValidationErrors, ValidatorFn} from "./validator";
import {computed, isSignal, signal, WritableSignal} from "@angular/core";

interface FormControlOptions<T> {
    value: T;
    disabled?: boolean;
    validators?: ValidatorFn<T>[];
}

export interface FormControl<T> extends Form<T, ValidationErrors> {

    /**
     * Signal that declares if the control is disabled or not
     */
    readonly disabled: WritableSignal<boolean>;

}

export const isFormControl = <T> (val: unknown): val is FormControl<T> => {
    return isSignal(val) &&
        'errors' in val && isSignal(val.errors) &&
        'validators' in val && isSignal(val.validators) &&
        'disabled' in val && isSignal(val.disabled);
};

const isSimpleFormOptions = <T> (val: T | FormControlOptions<T>): val is FormControlOptions<T> => {
    return !!val && typeof val === 'object' &&
        'value' in val &&
        (!('disabled' in val) || typeof val.disabled === 'boolean') &&
        (!('validators' in val) || Array.isArray(val.validators));
}

export function formControl<T>(val: T | FormControlOptions<T>): FormControl<T> {
    if (isSimpleFormOptions(val)) {
        return createSimpleForm(val);
    } else {
        return createSimpleForm({
            value: val,
            disabled: false,
            validators: [],
        })
    }
}

const createSimpleForm = <T> (options: FormControlOptions<T>): FormControl<T> => {
    const form = createAbstractForm(signal(options.value)) as FormControl<T>;

    if (options.validators) {
        form.addValidators(...options.validators);
    }

    Object.defineProperty(form, 'errors', {
        value: computed(() => {
            const validators = form.validators();
            const value = form();

            const errors = [...validators].map(validator => validator(value))
                .filter((error): error is ValidationErrors => !!error);

            return errors.length > 0 ?
                errors.reduce((error, current) => Object.assign(error, current), {}) :
                null;
        })
    });

    Object.defineProperty(form, 'disabled', {
        value: signal(!!options.disabled)
    });

    return form;
}
