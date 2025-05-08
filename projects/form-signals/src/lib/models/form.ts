import {ValidatorFn} from "./validator";
import {signal, Signal, WritableSignal} from "@angular/core";

export interface Form<T, E> extends WritableSignal<T> {

    /**
     * The current value of errors.
     * null is considered as VALID!
     */
    readonly errors: Signal<E | null>;

    /**
     * Holds all registered validators of the form
     */
    readonly validators: Signal<ValidatorFn<T>[]>;

    /**
     * Adds some validators to this form.
     * You can't add the same validator twice, this will be ignored by its implementation.
     *
     * After adding, the form will be validated again
     *
     * @param validators the validators you want to add
     */
    addValidators(...validators: ValidatorFn<T>[]): void;

    /**
     * Removes some validators from this form.
     * If you try to remove a validator that doesn't exist in this form, it will be ignored
     *
     * After removing, the form will be validated again
     *
     * @param validators the validators you want to remove
     */
    removeValidators(...validators: ValidatorFn<T>[]): void;

    /**
     * Checks if a validator exists inside this form
     *
     * @param validator the validator you want to check
     */
    hasValidator(validator: ValidatorFn<T>): boolean;
}


export const createAbstractForm = <T, E> (getter: (() => T)): Form<T, E> => {
    const form = getter as Form<T, E>;

    const _validators = signal<ValidatorFn<T>[]>([]);
    Object.defineProperty(form, "validators", {
        value: _validators,
        writable: false
    });

    Object.defineProperty(form, "addValidators", {
        value: (...validators: ValidatorFn<T>[]): void => {
            const set = new Set<ValidatorFn<T>>(_validators());
            validators.forEach(validator => set.add(validator));

            _validators.set([...set]);
        }
    });

    Object.defineProperty(form, "removeValidators", {
        value: (...validators: ValidatorFn<T>[]): void => {
            const set = new Set<ValidatorFn<T>>(_validators());
            validators.forEach(validator => set.delete(validator));

            _validators.set([...set]);
        }
    });

    Object.defineProperty(form, "hasValidator", {
        value: (validator: ValidatorFn<T>): boolean => {
            const set = new Set<ValidatorFn<T>>(_validators());

            return set.has(validator);
        }
    });

    return form;
}
