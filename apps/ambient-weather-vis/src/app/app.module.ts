import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './basic/header/header.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewComponent } from './preview/preview.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherVisualisationComponent } from './weather-visualisation/weather-visualisation.component';
import {
  TemperatureVisualisationComponent
} from './weather-visualisation/temperature-visualisation/temperature-visualisation.component';
import {
  WindSpeedVisualisationComponent
} from './weather-visualisation/wind-speed-visualisation/wind-speed-visualisation.component';
import { InfoComponent } from './basic/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PreviewComponent,
    WeatherVisualisationComponent,
    TemperatureVisualisationComponent,
    WindSpeedVisualisationComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    // ToDo need to be removed
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
