# Angular Form-Signals

Simple Reimplementation of [Angular Forms](https://www.npmjs.com/package/@angular/forms) in Signals.
Focused on simplicity, with full [Angular Material](https://www.npmjs.com/package/@angular/material) support. 

## Table of Contents
- [Installation](#installation)
- [Compatibility List](#compatibility-list)
- [Usage](#usage)
- [Differences to Angular](#differences-to-angular)
- [Contributing](#contributing)
- [License](#license)

## Installation
Install the library by using npm, pnpm or yarn:

```bash
npm install @rytrox/form-signals
```

```bash
pnpm install @rytrox/form-signals
```

```bash
yarn add @rytrox/form-signals
```

## Compatibility List

| Angular Version | Library Version |
|:---------------:|:---------------:|
|     ^19.2.0     |     ^1.0.0      |


## Usage

### FormControl
The popular `FormControl` in Angular is now a `WritableSignal`. It does not allow null if not explicitly specified in you declaration.
You can create a `FormControl` by using the following function

```ts
import {formControl} from '@rytrox/form-signals';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    
    // Creates a FormControl that allows null
    protected readonly stringControl = formControl<string | null>('Hello');
    
    // Creates a FormControl that only allows string, but with validators
    protected readonly controlWithValidators = formControl({
        value: 'World',
        disabled: false, // optional, default value is false
        validators: [
            (val) => val.length > 0 ? {required: 'This field is required!'} : null,
        ]
    });
}
```

`ValidatorFn` is now type-safe. You can validate against the current value of the form.

#### Binding your FormControl in Templates
By default, we provide Directives for any Material- and HTML-Component that is interactable.
Those Directives are strictly typed. You can bind `FormControl` by using the `[form]`-Directive

```angular2html
<input type="text" [form]="form">
<!-- or. -->
<select [form]="form">
    ...
</select>
```

This table shows supported types on certain Components:

| Directive                     | Component                                                                 | Supported FormControls                                                               |
|-------------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| InputCheckboxDirective        | `<input type="checkbox" ...>`                                             | `FormControl<boolean>`                                                               |
| InputDateDirective            | `<input type="date" ...>`, also `type="datetime-local"` and `type="time"` | `FormControl<Date>`                                                                  |
| InputFileDirective            | `<input type="file" ...>`                                                 | `FormControl<File \| null>`, `FormControl<File[]>` when input accepts multiple files |
| InputNumberDirective          | `<input type="number" ...>`                                               | `FormControl<number>`                                                                |
| InputRadioDirective           | `<input type="radio" value="..." ...>`                                    | `FormControl<string>`                                                                |
| InputRangeDirective           | `<input type="range" ...>`                                                | `FormControl<number>`                                                                |
| InputTextDirective            | Fallback for any other input and `<textarea ...>`                         | `FormControl<string>`                                                                |
| MatButtonToggleGroupDirective | MatButtonToggleGroup                                                      | `FormControl<T>`                                                                     |
| MatCheckboxDirective          | MatCheckbox                                                               | `FormControl<boolean>`                                                               |
| MatDatepickerDirective        | `<input [matDatepicker]="..." ...>`                                       | `FormControl<D \| null>`                                                             |
| MatRadioGroupDirective        | MatRadioGroup                                                             | `FormControl<T>`                                                                     |
| MatSelectDirective            | MatSelect                                                                 | `FormControl<T \| null>`, `FormControl<T[]>` on multiple select                      |
| MatSlideToggleDirective       | MatSlideToggle                                                            | `FormControl<boolean>`                                                               |
| MatSliderRangeThumbDirective  | MatSliderRangeThumb                                                       | `FormControl<number>`                                                                |
| MatSliderThumbDirective       | MatSliderThumb                                                            | `FormControl<number>`                                                                |
| SelectDirective               | `<select ...>`                                                            | `FormControl<string>`                                                                |

Usage of those Form-Directives are identical to `Angular-FormControl` / `ngModel`-Directives.
For more information, have a look at the official [Angular Material Documentation](https://material.angular.dev/components/categories)

#### Reacting to FormChanges
Since all Forms are now `Signals`, you can use `effect`, `computed` etc. to react to value changes inside Forms.

```ts
import {formControl} from '@rytrox/form-signals';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    protected readonly form = formControl<string | null>('Hello');

    public constructor() {
        effect(() => {
            const val = form();
            
            // Interact with the value itself...
            form.set(`${val} World`);
        });
    }
}
```

#### Validators
Validators are now Functions that are bound to the FormControl's value.
You can either create a `FormControl` with Validators or you can add them by using the `addValidator` or `removeValidator` methods.

Via `FormControl#validators`, you have access to a signal of all validators of a form. You can 

### FormGroup
`FormGroup` is a record of multiple forms that creates a computed value of multiple forms.
You can declare a Builder-Function of a `FormGroup` by using the Factory-Function.

Let's assume, we have a Model like this:
```ts
interface Foo {
    name: string;
    id: number | null;
    date?: Date;
}
```

By using the `formGroupFactory`-Function, we create a Signal-Builder that creates our FormGroup:

```ts
export const FooGroup = formGroupFactory((val?: Foo) => {
    return {
        name: formControl(val?.name ?? ''),
        id: formControl(val?.id ?? null),
        date: formControl(val?.date)
    };
});
```

If a key is declared as optional, you can remove its control at any time by using `setControl(null)`. 
However, we must declare them inside our factory.

Now, we can create a FormGroup like this:
```ts
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    protected readonly form = FooGroup();

    public constructor() {
        effect(() => {
            const val: Foo = form();
            
            // Interact with the value itself...
        });
    }
}
```

#### Access children of the group
You can access every field inside our `FormGroup` by using its key like this:
```ts
const form = FooGroup();

const nameControl = form.name;
```

Properties of FormGroups cannot be named like `errors`, `validators`, `addValidators`, `removeValidators`, `setControl`, `hasValidator`.

#### Error Handling
You can access errors of all child forms by using the `errors` Signal of the group.
For example a typical form error looks like this:

```json
{
    "this": {
        "validator1": "Group-Validator #1",
        "validator2": "Group-Validator #2"
    },
    "controls": {
        "name": {
            "required": "This field is required!"
        },
        "id": {
            "required": "This field is required!"
        }
    }
}
```

### FormArray
A `FormArray` is an array of the same form. 
Like `FormGroup` it creates a computed array of multiple forms.

You can create a new `FormArray`-Build by using the `formArrayFactory`-Function like this:

```ts
import {formArrayFactory} from "./form-array";

const FooArray = formArrayFactory((foo: Foo) => FooGroup(foo));
```

After that, you can create an Instance by using the builder just like before:
```ts
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    protected readonly form = FooArray([]);

    public constructor() {
        effect(() => {
            const val: Foo[] = form();
            
            // Interact with the value itself...
        });
    }
}
```

In contrast to Angular's `FormArray`, this one will not throw errors if you set a new Array with a different length.
Instead, it will automatically create new Forms for each value by using the factory function you declared earlier. 

#### Iterating over the array
You can iterate though the `FormArray` like any other array by using for-of loop:
```ts
const form = FooArray([]);
for (const control of form) {
    
}
```

#### Accessing the child
You can access the child by using its index:

```ts
const form = FooArray([]);
const control: FormGroup | undefined = form[0];
```
It will return `undefined`, if the index is not set.

#### Error-Handling
Similar to `FormGroup`, you can access every error of each child form by using the `error`-Signal.
The Error will look like this:

```json
{
  "this": {
    "validator1": "Array Validator #1"
  },
  "controls": [
    {
      "this": {
        "validator1": "Group Validator #1"
      },
      "controls": {
        "name": {
          "required": "This field is required"
        },
        "id": {
          "required": "This field is required"
        }
      }
    },
    null,
    {
      "this": null,
      "controls": {
        "name": {
          "required": "This field is required"
        }
      }
    }
  ]
}
```

## Contributing

Please feel free to contribute to this project  
by creating issues or pull requests on our [mirror project](https://github.com/Rytrox/form-signals)

## License

Copyright (c) 2025 Team Rytrox  
Licensed under the MIT license  
