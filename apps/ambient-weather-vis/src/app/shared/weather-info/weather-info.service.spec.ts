import { TestBed } from '@angular/core/testing';

import { WeatherInfoService } from './weather-info.service';
import { SharedModule } from "../shared.module"

describe('WeatherInfoService', () => {
  let service: WeatherInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
    });
    service = TestBed.inject(WeatherInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
