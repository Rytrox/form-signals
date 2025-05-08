import {formControl} from './form-control';

describe('FormControl', () => {
    it('should create an instance', () => {
        const form = formControl('');
        expect(form).toBeTruthy();
        expect(form()).toBe('')
    });

    it('should set values', () => {
        const form = formControl('');
        form.set('value');

        expect(form()).toBe('value');
    });

    it('should disable form', () => {
        const form = formControl('');
        form.disabled.set(true);
        expect(form.disabled()).toBe(true);

        form.disabled.set(false);
        expect(form.disabled()).toBe(false);
    })

    it('should set validators', () => {
        const form = formControl<string | null>('');
        expect(form.validators().length).toBe(0);

        form.addValidators(val => {
            return val !== null ? null : {
                nullable: 'Dieses Feld ist erforderlich'
            };
        });

        expect(form.validators().length).toBe(1);
    });

    it('should validate correctly', () => {
        const form = formControl<string | null>({
            value: null,
            validators: [
                val => val !== null ? null : {required: 'Dieses Feld ist erforderlich'}
            ]
        });

        expect(form.validators().length).toBe(1);
        expect(form.errors()).toEqual({required: 'Dieses Feld ist erforderlich'});

        form.set('');
        expect(form.errors()).toBeNull();
    })
});
