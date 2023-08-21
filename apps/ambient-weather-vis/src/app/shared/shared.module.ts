import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { ReactiveFormsModule } from "@angular/forms";
import { WeatherInfoService } from "./weather-info/weather-info.service"
import { HttpClientModule } from "@angular/common/http"

@NgModule({
  declarations: [ WeatherInfoComponent ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    MaterialModule,
    WeatherInfoComponent
  ],
  providers: [ WeatherInfoService ]
})
export class SharedModule {
}
