import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms"
import { WeatherInfo } from "./shared/weather-info/weather-info"

@Component({
  selector: 'ambient-weather-vis',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  public weatherInfoFormControl = new FormControl<WeatherInfo | null>(null);

  public ngOnInit(): void {
    this.weatherInfoFormControl
      .valueChanges
      .subscribe(info => console.log('AppComponent', info))
  }
}
