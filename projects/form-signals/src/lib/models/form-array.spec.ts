import {formArrayFactory} from "./form-array";
import {formControl} from "./form-control";
import {TestBed} from "@angular/core/testing";

const StringArray = formArrayFactory((val: string) => formControl(val));

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

    it('should add and remove controls when group is enabled', () => {
        const array = StringArray(['Hello', 'World']);
        expect(array).toBeTruthy();
        expect(array.length).toBe(2);

        array.push('!');
        expect(array.length).toBe(3);

        const removed = array.pop();
        expect(removed!()).toBe('!');
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
});
