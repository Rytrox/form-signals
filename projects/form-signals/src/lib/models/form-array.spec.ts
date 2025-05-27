import {formArrayFactory} from "./form-array";
import {formControl, isFormControl} from "./form-control";
import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {effect} from "@angular/core";
import {formGroupFactory} from "./form-group";

interface Bar {
    bar: string;
}

const BarGroup = formGroupFactory((val?: Bar) => {
    return {
        bar: formControl(val?.bar ?? '')
    }
})

const StringArray = formArrayFactory((val: string) => formControl(val));

const BarArray = formArrayFactory((val: Bar) => BarGroup(val));

describe('FormArray', () => {

    it('should create instance', () => {
        const array = StringArray([]);
        expect(array).toBeTruthy();
    });

    it('should create instance with forms', () => {
        const array = StringArray(['Hello', 'World']);
        expect(array).toBeTruthy();
        expect(array.length).toBe(2);

        const firstControl = array[0];
        expect(array[0]).toBe(firstControl);
        expect(firstControl).toBeTruthy();
        expect(firstControl!()).toBe('Hello');

        const secondControl = array[1];
        expect(array[1]).toBe(secondControl);
        expect(secondControl).toBeTruthy();
        expect(secondControl!()).toBe('World');
    });


    it('should update value when child value is updated', fakeAsync(async () => {
        TestBed.runInInjectionContext(() => {
            const array = StringArray(['Test']);

            effect(() => {
                const val = array();

                expect(val[0]).toBe('Changed');
            });

            array[0]?.set('Changed');
            tick(1);
        });
    }));

    it('should update value when child of child value is updated', fakeAsync(async () => {
        TestBed.runInInjectionContext(() => {
            const array = BarArray([
                {
                    bar: 'Test'
                }
            ]);
            effect(() => {
                const val = array();

                expect(val[0]).toBeTruthy();
                expect(val[0].bar).toBe('Hello World');
            });

            array[0]?.bar.set('Hello World');
            tick(1);
        });
    }));

    it('should push values and include them as well', () => {
        const array = StringArray(['Hello', 'World']);
        expect(array.length).toBe(2);

        array.push('!');
        expect(array.length).toBe(3);
        expect(array[2]).toBeTruthy();
        expect(array[2]!()).toBe('!');

        array.pop();
        expect(array.length).toBe(2);
        expect(array[2]).toBeUndefined();
    });

    it('should add and remove controls when group is enabled', () => {
        const array = StringArray(['Hello', 'World']);
        expect(array).toBeTruthy();
        expect(array.length).toBe(2);

        array.push('!');
        expect(array.length).toBe(3);

        array.pop();
        expect(array.length).toBe(2);
    });

    it('should iterate through form array', () => {
        const array = StringArray(['Hello', 'World']);

        let index = 0;
        for (const control of array) {
            expect(control).toBeTruthy();

            expect(control).toBe(array[index]);
            index++;
        }
    });

    it('should set new array and reindex all controls', () => {
        const array = StringArray(['A', 'B', 'C', 'D', 'E', 'F']);

        array.set(['A', 'B', 'C']);

        expect(array()).toEqual(['A', 'B', 'C']);
        expect(array.length).toBe(3);
        expect(array[0]!()).toBe('A');
        expect(array[1]!()).toBe('B');
        expect(array[2]!()).toBe('C');
        expect(array[3]).toBeUndefined();
        expect(array[4]).toBeUndefined();
        expect(array[5]).toBeUndefined();
    });

    it('should disable all controls', async () => {
        TestBed.runInInjectionContext(() => {
            const array = StringArray(['A', 'B', 'C', 'D', 'E', 'F']);
            for (const control of array) {
                expect(control.disabled()).toBe(false);
            }

            array.disable();
            for (const control of array) {
                expect(control.disabled()).toBe(true);
            }
        });
    });

    it('should update value via "update"-Method', async () => {
        TestBed.runInInjectionContext(() => {
            const array = StringArray(['A', 'B', 'C', 'D', 'E', 'F']);

            array.update(arr => arr.map(e => e.toLowerCase()));
            expect(array()).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
    });

    it('should map array with control', async () => {
        TestBed.runInInjectionContext(() => {
            const array = StringArray(['A', 'B', 'C', 'D', 'E', 'F']);

            const values = array.map(control => {
                expect(isFormControl(control)).toBe(true);

                return control().toLowerCase();
            });

            expect(values).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
    });

    it('should do forEach with controls', async () => {
        TestBed.runInInjectionContext(() => {
            const array = StringArray(['A', 'B', 'C', 'D', 'E', 'F']);

            array.forEach(control => {
                expect(isFormControl(control)).toBe(true);
            });
        })
    })
});
