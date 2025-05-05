import {formGroupFactory} from './form-group';
import {formControl} from "./form-control";
import {TestBed} from "@angular/core/testing";
import {formArrayFactory} from "./form-array";

interface Bar {
    bar: string;
}

interface Foo {
    name: string,
    id: number | null,
    date: Date | null,
    bar?: Bar,
    array: Bar[]
}


const BarGroup = formGroupFactory((val?: Bar) => {
    return {
        bar: formControl(val?.bar ?? '')
    }
})

const BarGroupArray = formArrayFactory(
    (bar: Bar) => BarGroup(bar)
);

const FooGroup = formGroupFactory((val?: Foo) => {
    return {
        name: formControl({
            value: val?.name ?? '',
            validators: [
                value => value ? null : {
                    required: 'Dieses Feld ist erforderlich'
                }
            ]
        }),
        id: formControl(val?.id ?? null),
        date: formControl(val?.date ?? null),
        bar: BarGroup(val?.bar),
        array: BarGroupArray(val?.array ?? []),
    }
})

describe('FormGroup', () => {

    it('should create an instance by factory', async () => {
        TestBed.runInInjectionContext(() => {
            const group = BarGroup();
            expect(group).toBeTruthy();
            expect(group.bar()).toBe('');
        });
    });

    it('should set value to controls', async () => {
        TestBed.runInInjectionContext(() => {
            const group = FooGroup();
            expect(group()).toEqual({
                name: '',
                id: null,
                date: null,
                bar: {
                    bar: '',
                },
                array: []
            });

            group.set({
                bar: {
                    bar: 'Hello World'
                },
                date: new Date(),
                name: 'Hello',
                id: 1,
                array: []
            });
            const barControl = group.bar;
            expect(barControl).toBeTruthy();
            expect(barControl!.bar()).toBe('Hello World');
            expect(barControl!()).toEqual({bar: 'Hello World'});
        });
    });

    it('should add group validators', async () => {
        TestBed.runInInjectionContext(() => {
            const group = BarGroup();
            expect(group.validators().length).toBe(0);

            group.addValidators(val => {
                return val.bar ? null : { requiredField: 'in Bar muss Inhalt stehen' }
            });

            expect(group.validators().length).toBe(1);
        })
    });

    it('should calculate error correctly', async () => {
        TestBed.runInInjectionContext(() => {
            const group = FooGroup();
            expect(group.errors()).toEqual({
                this: null,
                controls: {
                    name: {
                        required: 'Dieses Feld ist erforderlich'
                    }
                }
            });

            group.id.addValidators(id => typeof id === 'number' ? null : {
                required: 'Dieses Feld ist erforderlich'
            });

            expect(group.errors()).toEqual({
                this: null,
                controls: {
                    name: {
                        required: 'Dieses Feld ist erforderlich'
                    },
                    id: {
                        required: 'Dieses Feld ist erforderlich'
                    }
                }
            });

            group.addValidators(val => val.date ? null : {
                dateRequired: 'Es muss ein Datum angegeben werden'
            });

            expect(group.errors()).toEqual({
                this: {
                    dateRequired: 'Es muss ein Datum angegeben werden'
                },
                controls: {
                    name: {
                        required: 'Dieses Feld ist erforderlich'
                    },
                    id: {
                        required: 'Dieses Feld ist erforderlich'
                    }
                }
            });

            group.set({
                bar: {
                    bar: 'Hello World'
                },
                date: new Date(),
                name: 'Hello',
                id: 1,
                array: []
            });

            expect(group.errors()).toBeNull();
        });
    });

    it('should set optional controls', async () => {
        TestBed.runInInjectionContext(() => {
            const group = FooGroup();
            group.bar?.set({
                bar: 'Hello World'
            })

            expect(group.bar!()).toEqual({
                bar: 'Hello World'
            });

            group.setControl('bar', null);
            expect(group().bar).toBeUndefined();
            expect(group.bar).toBeUndefined();

            group.setControl('bar', BarGroup({ bar: 'Test' }));
            expect(group().bar).toEqual({ bar: 'Test' });
            expect(group.bar).toBeTruthy();
            expect(group.bar!()).toEqual({bar: 'Test'});
        });
    });

});
