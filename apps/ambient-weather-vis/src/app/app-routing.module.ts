import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from "./preview/preview.component";
import {
  TemperatureVisualisationComponent
} from "./weather-visualisation/temperature-visualisation/temperature-visualisation.component"

const routes: Routes = [
  { path: '', component: PreviewComponent },
  { path: 'temperature', component: TemperatureVisualisationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
