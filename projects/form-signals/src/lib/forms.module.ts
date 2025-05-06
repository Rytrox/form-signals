import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextDirective} from "./directives/input/input-text.directive";
import {InputNumberDirective} from "./directives/input/input-number.directive";
import {MatCheckboxDirective} from "./directives/material/mat-checkbox.directive";
import {InputCheckboxDirective} from "./directives/input/input-checkbox.directive";
import {InputDateDirective} from "./directives/input/input-date.directive";
import {InputRadioDirective} from "./directives/input/input-radio.directive";
import {MatRadioGroupDirective} from "./directives/material/mat-radio-group.directive";
import {InputRangeDirective} from "./directives/input/input-range.directive";
import {InputFileDirective} from "./directives/input/input-file.directive";
import {SelectDirective} from "./directives/select/select.directive";
import {MatSliderThumbDirective} from "./directives/material/mat-slider-thumb.directive";
import {MatSlideToggleDirective} from "./directives/material/mat-slide-toggle.directive";
import {MatSelectDirective} from "./directives/material/mat-select.directive";
import {MatButtonToggleGroupDirective} from "./directives/material/mat-button-toggle-group.directive";
import {MatSliderRangeThumbDirective} from "./directives/material/mat-slider-range-thumb.directive";
import {MatDatepickerDirective} from "./directives/material/mat-datepicker.directive";

export * from './directives/abstract-form-directive';

export * from './directives/input/input-checkbox.directive';
export * from './directives/input/input-date.directive';
export * from './directives/input/input-file.directive';
export * from './directives/input/input-number.directive';
export * from './directives/input/input-radio.directive';
export * from './directives/input/input-range.directive';
export * from './directives/input/input-text.directive';

export * from './directives/select/select.directive';

export * from './directives/material/mat-button-toggle-group.directive';
export * from './directives/material/mat-checkbox.directive';
export * from './directives/material/mat-datepicker.directive';
export * from './directives/material/mat-radio-group.directive';
export * from './directives/material/mat-select.directive';
export * from './directives/material/mat-slide-toggle.directive';
export * from './directives/material/mat-slider-range-thumb.directive';
export * from './directives/material/mat-slider-thumb.directive';

@NgModule({
    declarations: [
        InputCheckboxDirective,
        InputDateDirective,
        InputFileDirective,
        InputNumberDirective,
        InputRadioDirective,
        InputRangeDirective,
        InputTextDirective,

        SelectDirective,

        MatButtonToggleGroupDirective,
        MatCheckboxDirective,
        MatDatepickerDirective,
        MatRadioGroupDirective,
        MatSelectDirective,
        MatSlideToggleDirective,
        MatSliderRangeThumbDirective,
        MatSliderThumbDirective
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        InputCheckboxDirective,
        InputDateDirective,
        InputFileDirective,
        InputNumberDirective,
        InputRadioDirective,
        InputRangeDirective,
        InputTextDirective,

        SelectDirective,

        MatButtonToggleGroupDirective,
        MatCheckboxDirective,
        MatDatepickerDirective,
        MatRadioGroupDirective,
        MatSelectDirective,
        MatSlideToggleDirective,
        MatSliderRangeThumbDirective,
        MatSliderThumbDirective
    ]
})
export class FormsModule {
}
