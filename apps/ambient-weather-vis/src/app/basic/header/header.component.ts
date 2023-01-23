import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'ambient-weather-vis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  @Output()
  public infoClick = new EventEmitter()

  public constructor(private readonly router: Router) {
  }

  public goToHome(): void {
    this.router.navigate(['/']).then()
  }

  public showInfo(): void {
    this.infoClick.emit()
  }
}
