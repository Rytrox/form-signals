import {Component, effect} from '@angular/core';
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {MatSlider, MatSliderRangeThumb, MatSliderThumb} from "@angular/material/slider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatSelect, MatOption} from "@angular/material/select";
import {formGroupFactory} from "../../../form-signals/src/lib/form-group";
import {formControl} from "../../../form-signals/src/lib/form-control";
import { FormsModule } from '../../../form-signals/src/lib/forms.module';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";

interface Developer {
    id: number;
    name: string;
}

const developers = [
    {
        id: 1,
        name: "Timeout"
    },
    {
        id: 2,
        name: "Sether"
    },
    {
        id: 3,
        name: "Asedem"
    }
]

interface Test {
    text: string;
    number: number;
    boolean: boolean;
    date: Date | null;
    radioText: string;
    rangeMin: number;
    range: number;
    rangeMax: number;
    files: File[] | null;
    file: File | null;
    select: string;
    selects: string[];
    developers: DeveloperInformation;
}

interface DeveloperInformation {
    leader: Developer;
    members: Developer[];
}

const DeveloperInformationGroup = formGroupFactory((devInfo?: DeveloperInformation) => {
    return {
        leader: formControl(devInfo?.leader ?? developers[0]),
        members: formControl(devInfo?.members ?? developers),
    }
})

export const TestGroup = formGroupFactory((val?: Test) => {
    return {
        text: formControl(val?.text ?? ''),
        number: formControl(val?.number ?? 0),
        boolean: formControl(val?.boolean ?? false),
        date: formControl(val?.date ?? null),
        radioText: formControl(val?.radioText ?? ''),
        rangeMin: formControl(val?.rangeMin ?? 0),
        range: formControl(val?.range ?? 0),
        rangeMax: formControl(val?.rangeMax ?? 100),
        files: formControl(val?.files ?? null),
        file: formControl(val?.file ?? null),
        select: formControl(val?.select ?? ''),
        selects: formControl(val?.selects ?? []),
        developers: DeveloperInformationGroup(val?.developers)
    }
});

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        MatCheckbox,
        MatRadioGroup,
        MatRadioButton,
        MatInput,
        MatSlider,
        MatSliderThumb,
        MatSlideToggle,
        MatSelect,
        MatOption,
        MatFormField,
        MatSliderRangeThumb,
        MatButtonToggleModule,
        MatDatepickerToggle,
        MatSuffix,
        MatDatepicker,
        MatDatepickerInput
    ],
    providers: [
        provideNativeDateAdapter()
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    protected readonly group = TestGroup();
    protected readonly developers = developers;

    title = 'form-signals-test-project';

    public constructor() {
        effect(() => {
            console.log('Group: ', this.group());
        });
    }

}
