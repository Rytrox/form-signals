import {booleanAttribute, Directive, effect, ElementRef, HostListener, input} from '@angular/core';
import {AbstractFormDirective} from "../abstract-form-directive";
import {FormControl} from "../../form-control";

@Directive({
    selector: 'input[multiple][type=file][form], input[type="file"][form]',
    standalone: false
})
export class InputFileDirective extends AbstractFormDirective<File | File[] | null> {

    public readonly multiple = input(false, {transform: booleanAttribute});
    public readonly form = input.required<FormControl<File | null> | FormControl<File[] | null>>();

    public constructor(private element: ElementRef<HTMLInputElement>) {
        super();

        effect(() => {
            const form = this.form();

            const val = form();
            if (val) {
                const list = new DataTransfer();

                if (Array.isArray(val)) {
                    val.forEach(item => list.items.add(item));
                } else {
                    list.items.add(val);
                }

                element.nativeElement.files = list.files;
            } else {
                element.nativeElement.files = null;
            }
        });
    }

    @HostListener('input')
    public onFileChange(): void {
        const form = this.form();

        if (this.element.nativeElement.files) {
            const file = this.element.nativeElement.files;

            if (this.isFileArrayForm(form)) {
                const arr = [];
                for (let i = 0; i < file.length; i++) {
                    const item = file.item(i);
                    if (item) {
                        arr.push(item);
                    }
                }

                form.set(arr);
            } else {
                form.set(file.item(0));
            }
        } else {
            form.set(null);
        }
    }

    private isFileArrayForm(val: FormControl<File | null> | FormControl<File[] | null>): val is FormControl<File[] | null> {
        return this.multiple();
    }
}
