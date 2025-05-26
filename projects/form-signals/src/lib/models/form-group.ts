import {createAbstractForm, Form} from "./form";
import {computed} from "@angular/core";
import {ValidationErrors, ValidatorFn} from "./validator";
import {isFunction} from "lodash";
import {isFormControl} from "./form-control";

const forbiddenNames = [
    'addValidators',
    'removeValidators',
    'setControl',
    'hasValidator',
    'errors',
    'validators',
]

export type FormGroup<T extends {[K in keyof T]: T[K]}, F extends TForm<T>> = GroupControls<T, F> & Form<T, FormGroupErrors<T, F>> & {

    /**
     * Set Control of optional keys in T.
     * Controls that are not set, will have undefined keys in their value.
     * If your set the control with null, you will remove the control
     *
     * @param key the key you want to set
     * @param control the control you want to add
     */
    setControl<K extends OptionalKeys<T>>(key: K, control: F[K] | null): void;

    /**
     * Disables all included Forms of this FormGroup
     */
    disable(): void;

    /**
     * Enables all included Forms of this FormGroup
     */
    enable(): void;
};

export const formGroupFactory = <T extends {[K in keyof T]: T[K]}, F extends TForm<T>> (fn: (val?: T) => Required<F>): (val?: T) => FormGroup<T, F> => {
    return (val?: T) => {
        const controls = fn(val);

        // FIXME: I know this is not as performant as it should... Wait for Linked-Signals
        const form = createAbstractForm<T, F>(() => calcValue<T, F>(controls)) as FormGroup<T, F>;
        // Register Controls
        Object.entries<Form<any, any> | undefined>(controls)
            .filter((arr): arr is [keyof T & string, Form<any, any>] => !!arr[1])
            .forEach(([k, v]) => {
                if (!forbiddenNames.includes(k)) {
                    Object.defineProperty(form, k, {
                        value: v,
                        configurable: true
                    });
                } else {
                    throw new Error(`It is not allowed to name a property "${k}" inside a FormGroup. Please rename it`)
                }
            });

        Object.defineProperty(form, 'errors', {
            value: computed(() => {
                // construct Error object
                const groupErrors = calcGroupErrors<T>(form(), form.validators());
                const controlErrors = calcControlErrors<T, F>(controls);

                if (groupErrors === null && Object.keys(controlErrors).length === 0) {
                    return null;
                }

                return {
                    this: groupErrors,
                    controls: controlErrors
                };
            })
        });

        Object.defineProperty(form, 'set', {
            value: (val: T) => {
                Object.entries<Form<any, any> | undefined>(controls)
                    .filter((arr): arr is [keyof T & string, Form<any, any>] => !!arr[1])
                    .forEach(([key, control]) => {
                        control.set(val[key]);
                    });
            }
        });

        Object.defineProperty(form, 'update', {
            value: (fn: (val: T) => T): void => {
                form.set(fn(form()))
            }
        });

        Object.defineProperty(form, 'setControl', {
            value: <K extends OptionalKeys<T>>(key: K, control: F[K] | null) => {
                if (control) {
                    controls[key] = control;

                    Object.defineProperty(form, key, {value: control, configurable: true});
                } else {
                    delete controls[key];
                    Object.defineProperty(form, key, {value: undefined, configurable: true});
                }
            }
        });

        Object.defineProperty(form, 'disable', {
            value: () => {
                Object.values<Form<any, any> | undefined>(controls)
                    .filter((control): control is Form<any, any> => !!control)
                    .forEach(control => {
                        if (isFormControl(control)) {
                            control.disabled.set(true);
                        } else if ('disable' in control && isFunction(control.disable)) {
                            control.disable();
                        }
                    });
            }
        });

        Object.defineProperty(form, 'enable', {
            value: () => {
                Object.values<Form<any, any> | undefined>(controls)
                    .filter((control): control is Form<any, any> => !!control)
                    .forEach(control => {
                        if (isFormControl(control)) {
                            control.disabled.set(false);
                        } else if ('disable' in control && isFunction(control.disable)) {
                            control.disable();
                        }
                    })
            }
        })

        return form;
    }
}

const calcValue = <T extends {[K in keyof T]: T[K]}, F extends TForm<T>>(controls: F): T => {
    return Object.fromEntries(
        Object.entries<Form<any, any> | undefined>(controls)
            .filter((arr): arr is [string, Form<any, any>] => !!arr[1])
            .map(([key, val]) => [key, val()])
    ) as T;
}

const calcGroupErrors = <T extends {[K in keyof T]: T[K]}>(value: T, validators: ValidatorFn<T>[]): ValidationErrors | null => {
    const errors = validators.map(validator => validator(value))
        .filter((error): error is ValidationErrors => !!error);

    if (errors.length === 0) {
        return null;
    }

    return errors.reduce((error, current) => Object.assign(error, current), {});
}

const calcControlErrors = <T extends {[K in keyof T]: T[K]}, F extends TForm<T>>(controls: F): ControlErrors<T, F> => {
    return Object.fromEntries(
        Object.entries<Form<any, any> | undefined>(controls)
            .filter((arr): arr is [string, Form<any, any>] => !!arr[1])
            .map(([key, val]) => [key, val.errors()])
            .filter(([_key, val]) => !!val)
    ) satisfies ControlErrors<T, F>;
}

export interface FormGroupErrors<T extends {[K in keyof T]: T[K]}, F extends TForm<T>> {
    this: ValidationErrors | null;
    controls: ControlErrors<T, F>
}

export type ControlErrors<T extends {[K in keyof T]: T[K]}, F extends TForm<T>> = Partial<{
    [K in keyof F]: F[K] extends Form<any, infer E> ? E : never;
}>;

export type TForm<T> = {
    [K in keyof T]: K extends OptionalKeys<T> ?
        (Form<Exclude<T[K], undefined>, any> | undefined) :
        Form<Exclude<T[K], undefined>, any>;
}

// Select only Optional Keys
export type OptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

export type GroupControls<T extends {[K in keyof T]: T[K]}, F extends TForm<T>> = {
    [K in keyof T]: K extends OptionalKeys<T> ? F[K] | undefined : F[K]
}

