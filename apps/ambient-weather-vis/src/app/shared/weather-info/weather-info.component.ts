import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { WeatherInfoService } from "./weather-info.service"
import { WeatherInfo } from "./weather-info"
import { first } from "rxjs"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: 'ambient-weather-vis-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeatherInfoComponent),
      multi: true
    }
  ]
})
export class WeatherInfoComponent implements ControlValueAccessor {
  @Input() public question = ''
  public locationFormControl = new FormControl<string>("",
    {
      validators: [Validators.required],
      nonNullable: true
    })

  private onChange: ((info: WeatherInfo | null) => void) | undefined

  public constructor(private readonly service: WeatherInfoService,
                     private readonly snackBar: MatSnackBar) {
  }

  public registerOnChange(fn: (info: WeatherInfo | null) => void): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public registerOnTouched(_: (info: WeatherInfo) => void): void {
    // not implemented
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeValue(_: WeatherInfo): void {
    // not implemented
  }

  public onSearch(): void {
    const location = this.locationFormControl.value
    this.service.getInfo(location)
      .pipe(first())
      .subscribe({
        next: info => this.onChange && this.onChange(info),
        error: () => {
          this.snackBar.open(
            `No weather info available for "${location}"`,
            'Ok',
            { duration: 5000 }
          )
          this.onChange && this.onChange(null)
        }
      })
  }
}
