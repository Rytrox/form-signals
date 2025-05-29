import {createAbstractForm, Form} from "./form";
import {ValidationErrors, ValidatorFn} from "./validator";
import {computed, signal} from "@angular/core";
import {isFormControl} from "./form-control";
import {isFunction} from "lodash";

export interface FormArray<F extends Form<any, any>> extends Form<FormArrayValue<F>, FormArrayErrors<FormError<F>>>, Iterable<F> {

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
    push(value: FormValue<F>): void;

    /**
     * Removes the element at a certain index.
     * All elements after the index is going to be reordered.
     * If the index does not exist, this method will do nothing
     *
     * @param index the index you want to remove
     */
    removeAt(index: number): void;

    /**
     * Removes the last control of this FormArray and returns it.
     */
    pop(): void;

    /**
     * Disables all included Forms of this FormArray
     */
    disable(): void;

    /**
     * Enables all included Forms of this FormArray
     */
    enable(): void;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     *
     * @param callbackFn A function that accepts up to three arguments.
     *                   The map method calls the callbackFn function one time for each element in the array.
     */
    map<U>(callbackFn: (control: F, index: number, array: F[]) => U): U[];

    /**
     * Performs the specified action for each element in an array.
     * @param callbackFn A function that accepts up to three arguments.
     *                   forEach calls the callbackFn function one time for each element in the array.
     */
    forEach(callbackFn: (control: F, index: number, array: F[]) => void): void;

}

type FormError<F> = F extends Form<any, infer E> ? E : never;
type FormValue<F> = F extends Form<infer T, any> ? T : never;
type FormArrayValue<F> = F extends Form<infer T, any> ? T[] : never;

export const formArrayFactory = <F extends Form<any, any>> (fn: (val: FormValue<F>) => F): (val: FormArrayValue<F>) => FormArray<F> => {
    return val => {
        const controls = signal(val.map(element => fn(element)));

        const form = createAbstractForm(computed(() => calcValue<F>(controls()))) as FormArray<F>;
        reindexArray(form, controls());

        Object.defineProperty(
            form,
            'length',
            {
                get(): number {
                    return controls().length;
                }
            }
        )

        Object.defineProperty(form, 'push', {
            value: (value: FormValue<F>) => {
                const control = fn(value);
                controls.update(c => [...c, control]);

                reindexArray(form, controls());
            }
        });

        Object.defineProperty(form, 'removeAt', {
            value: (index: number) => {
                controls.update(controls => controls.filter((_control, i) => i !== index));

                reindexArray(form, controls());
            }
        })

        Object.defineProperty(form, 'pop', {
            value: () => {
                controls.update(c => {
                    c.pop();

                    return [...c];
                });

                Object.defineProperty(form, controls().length, {
                    value: undefined,
                    configurable: true
                });
            }
        });

        Object.defineProperty(form, Symbol.iterator, {
            get(): any {
                return controls()[Symbol.iterator];
            }
        });

        Object.defineProperty(form, 'errors', {
            value: computed(() => {
                // construct Error object
                const groupErrors = calcGroupErrors<F>(form(), form.validators());
                const controlErrors = calcControlErrors<F>(controls());

                if (groupErrors === null && Object.keys(controlErrors).length === 0) {
                    return null;
                }

                return {
                    this: groupErrors,
                    controls: controlErrors
                } satisfies FormArrayErrors<F>;
            })
        });

        Object.defineProperty(form, 'set', {
            value: (array: FormArrayValue<F>) => {
                const properties = Object.fromEntries(
                    controls().map((_control, index) => {
                        return [index, {
                            value: undefined,
                            configurable: true
                        }];
                    })
                );

                controls.set(array.map(element => fn(element)));
                Object.assign(properties, Object.fromEntries(
                    controls().map((control, index) => {
                        return [index, {
                            value: control,
                            configurable: true
                        }]
                    })
                ));

                Object.defineProperties(form, properties);
            }
        });

        Object.defineProperty(form, 'update', {
            value: (fn: (val: FormArrayValue<F>) => FormArrayValue<F>) => {
                form.set(fn(form()));
            }
        });

        Object.defineProperty(form, 'disable', {
            value: () => {
                controls().forEach(control => {
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
                controls().forEach(control => {
                    if (isFormControl(control)) {
                        control.disabled.set(false);
                    } else if ('enable' in control && isFunction(control.enable)) {
                        control.enable();
                    }
                })
            }
        });

        Object.defineProperty(form, 'map', {
            value: <U> (callbackFn: (control: F, index: number, array: F[]) => U) => {
                return controls().map(callbackFn);
            }
        });

        Object.defineProperty(form, 'forEach', {
            value: (callbackFn: (control: F, index: number, array: F[]) => void) => {
                controls().forEach(callbackFn);
            }
        });

        return form;
    }
}

const calcValue = <F extends Form<any, any>>(controls: F[]): FormArrayValue<F> => {
    return controls.map(control => control()) as FormArrayValue<F>;
}

const reindexArray = <F extends Form<any, any>>(form: FormArray<F>, controls: F[]): void => {
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
}

const calcGroupErrors = <F>(value: FormArrayValue<F>, validators: ValidatorFn<FormArrayValue<F>>[]): ValidationErrors | null => {
    const errors = validators.map(validator => validator(value))
        .filter((error): error is ValidationErrors => !!error);

    if (errors.length === 0) {
        return null;
    }

    return errors.reduce((error, current) => Object.assign(error, current), {});
}

const calcControlErrors = <F extends Form<any, any>>(controls: F[]): FormError<F>[] => {
    return controls.map(control => control.errors());
}


export interface FormArrayErrors<F> {
    this: ValidationErrors | null;
    controls: FormError<F>[]
}
