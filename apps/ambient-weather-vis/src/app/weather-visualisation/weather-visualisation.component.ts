import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms"
import { WeatherInfo } from "../shared/weather-info/weather-info"

@Component({
  selector: 'ambient-weather-vis-weather-visualisation',
  templateUrl: './weather-visualisation.component.html',
  styleUrls: ['./weather-visualisation.component.sass'],
})
export class WeatherVisualisationComponent implements OnInit {
  public question = ''
  public weatherInfoFormControl = new FormControl<WeatherInfo | null>(null)

  public ngOnInit(): void {
    this.weatherInfoFormControl
      .valueChanges
      .subscribe(info => this.updateVisualisation(info))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  protected updateVisualisation(info: WeatherInfo | null): void {}
}
