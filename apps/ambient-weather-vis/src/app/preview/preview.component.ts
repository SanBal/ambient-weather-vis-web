import { Component } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'ambient-weather-vis-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.sass'],
})
export class PreviewComponent {

  public constructor(private readonly router: Router) {
  }

  public goToVisualisation(visualisation: string): void {
    this.router.navigate([`/${visualisation}`]).then()
  }
}
