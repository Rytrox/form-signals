export type ValidationErrors = Record<string, string>;

export type ValidatorFn<V> = (value: V) => (ValidationErrors | null);
