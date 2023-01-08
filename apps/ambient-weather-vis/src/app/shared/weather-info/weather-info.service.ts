/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { map, mergeMap, Observable } from "rxjs"
import { WeatherInfo } from "./weather-info"

const GEO_COORDINATES_URL = (location: string) =>
  `https://nominatim.openstreetmap.org/search/${location}?format=json&limit=1`;

const INFO_URL = (latitude: string, longitude: string) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

@Injectable()
export class WeatherInfoService {

  public constructor(private readonly httpClient: HttpClient) {
  }

  public getInfo(location: string): Observable<WeatherInfo> {
    return this.getGeoCoordinates(location)
      .pipe(
        mergeMap(coordinates => {
          return this.httpClient.get<any>(INFO_URL(coordinates.latitude, coordinates.longitude))
            .pipe(
              map(resp => resp.current_weather),
              map(currWeather => ({temperature: currWeather.temperature, windSpeed: currWeather.windspeed}))
            )
        })
      );
  }

  private getGeoCoordinates(location: string): Observable<{ latitude: string, longitude: string }> {
    return this.httpClient.get<any[]>(GEO_COORDINATES_URL(location))
      .pipe(
        map(resp => resp[0]),
        map(location => ({latitude: location.lat, longitude: location.lon}))
      );
  }
}
