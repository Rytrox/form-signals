import {createAbstractForm, Form} from "./form";
import {ValidationErrors, ValidatorFn} from "./validator";
import {computed} from "@angular/core";

export interface FormArray<T, F extends Form<T, E>, E> extends Form<T[], FormArrayErrors<T, E>>, Iterable<F> {

    /**
     * Returns the amount of elements inside this FormArray
     */
    readonly length: number;

    /**
     * Access the control of the index. Returns undefined if the index is out of bounds
     */
    [index: number]: F | undefined;

    /**
     * Creates a new control based on a value and pushes it to this FormArray.
     *
     * @param value the value of the form array
     */
    push(value: T): void;

    /**
     * Removes the last control of this FormArray and returns it.
     */
    pop(): F | undefined;

}

export const formArrayFactory = <T, F extends Form<T, E>, E> (fn: (val: T) => F): (val: T[]) => FormArray<T, F, E> => {
    return val => {
        let controls = val.map(element => fn(element));

        const form = createAbstractForm(computed(() => calcValue<T, F>(controls))) as FormArray<T, F, E>;
        Object.defineProperty(
            form,
            'length',
            {
                get(): number {
                    return controls.length;
                }
            }
        )

        Object.defineProperties(
            form,
            Object.fromEntries(
                controls.map((control, index) => {
                    return [index, {
                        value: control,
                        configurable: true
                    }];
                })
            )
        );

        Object.defineProperty(form, 'at', {
            value: (index: number) => controls.at(index)
        });

        Object.defineProperty(form, 'push', {
            value: (value: T) => {
                const control = fn(value);

                Object.defineProperty(form, controls.push(control), {
                    value: control,
                    configurable: true
                })
            }
        });

        Object.defineProperty(form, 'pop', {
            value: () => {
                const control = controls.pop();
                Object.defineProperty(form, controls.length, {
                    value: undefined,
                    configurable: true
                });

                return control;
            }
        });

        Object.defineProperty(form, Symbol.iterator, {
            get(): any {
                return controls[Symbol.iterator];
            }
        });

        Object.defineProperty(form, 'errors', {
            value: computed(() => {
                // construct Error object
                const groupErrors = calcGroupErrors<T>(form(), form.validators());
                const controlErrors = calcControlErrors<T, F, E>(controls);

                if (groupErrors === null && Object.keys(controlErrors).length === 0) {
                    return null;
                }

                return {
                    this: groupErrors,
                    controls: controlErrors
                } satisfies FormArrayErrors<T, E>;
            })
        });

        Object.defineProperty(form, 'set', {
            value: (array: T[]) => {
                const properties = Object.fromEntries(
                    controls.map((_control, index) => {
                        return [index, {
                            value: undefined,
                            configurable: true
                        }];
                    })
                );

                controls = array.map(element => fn(element));

                Object.assign(properties, Object.fromEntries(
                    controls.map((control, index) => {
                        return [index, {
                            value: control,
                            configurable: true
                        }]
                    })
                ));

                Object.defineProperties(form, properties);
            }
        });

        return form;
    }
}

const calcValue = <T, F extends Form<T, any>>(controls: F[]): T[] => {
    return controls.map(control => control());
}

const calcGroupErrors = <T>(value: T[], validators: ValidatorFn<T[]>[]): ValidationErrors | null => {
    const errors = validators.map(validator => validator(value))
        .filter((error): error is ValidationErrors => !!error);

    if (errors.length === 0) {
        return null;
    }

    return errors.reduce((error, current) => Object.assign(error, current), {});
}

const calcControlErrors = <T, F extends Form<T, E>, E>(controls: F[]): (E | null)[] => {
    return controls.map(control => control.errors());
}


export interface FormArrayErrors<T extends {[K in keyof T]: T[K]}, E> {
    this: ValidationErrors | null;
    controls: (E | null)[]
}
