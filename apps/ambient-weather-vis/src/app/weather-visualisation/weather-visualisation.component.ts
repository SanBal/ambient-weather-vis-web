import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms"
import { WeatherInfo } from "../shared/weather-info/weather-info"
import { Subscription } from "rxjs"

@Component({
  selector: 'ambient-weather-vis-weather-visualisation',
  templateUrl: './weather-visualisation.component.html',
  styleUrls: ['./weather-visualisation.component.sass'],
})
export class WeatherVisualisationComponent implements OnInit, OnDestroy {
  public question = ''
  public weatherInfoFormControl = new FormControl<WeatherInfo | null>(null)
  public weatherInfo: WeatherInfo | null = null
  private weatherInfoSubscription: Subscription | null = null

  public ngOnInit(): void {
    this.weatherInfoSubscription = this.weatherInfoFormControl
      .valueChanges
      .subscribe(info => {
        this.weatherInfo = info
        this.updateVisualisation(info)
      })
  }

  public ngOnDestroy(): void {
    this.weatherInfoSubscription?.unsubscribe()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  protected updateVisualisation(info: WeatherInfo | null): void {}
}
