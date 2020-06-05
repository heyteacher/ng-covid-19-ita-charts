import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node, generateRegionProvinceTree, orderDesc } from "./app.model";
import moment from 'moment';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

interface ObservableURLDictionary<T> {
  [Key: string]: T;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private observableURLDictionary: ObservableURLDictionary<Observable<any[]>> = {}
 
  private days: string[]

  constructor(private httpClient: HttpClient, private appConfigService: AppConfigService) {
    this.getCountryData()
    .subscribe((data) => this.days = data.map(e => moment(e.data).format('YYYY-MM-DD')).sort(orderDesc))
  }

    /**
   * caricamento dei dati via HTTP
   * @param url path del JSON
   */
  private getObservableURL(url: string): Observable<any[]> {
    if (!this.observableURLDictionary[url]) {
      this.observableURLDictionary[url] = this.httpClient.get<any[]>(url).pipe(shareReplay())
    }
    return this.observableURLDictionary[url]
  }

  /**
   * singleton get country data
   */
  getCountryData(): Observable<any[]> {
    return this.getObservableURL(this.appConfigService.countryDataSetURL)
  
    //this.days = this.countryData.map(e => moment(e.data).format('YYYY-MM-DD')).sort(orderDesc)
  }

  /**
   * singleton get regional forecast data
   */
  // getCountryARIMAForecastData(): Observable<any[]> {
  //   return this.getObservableURL(this.appConfigService.countryARIMAForecastDataURL)
  // }

  /**
   * singleton get regional forecast data
   */
  // getRegionalARIMAForecastData(): Observable<any[]> {
  //   return this.getObservableURL(this.appConfigService.regionalARIMAForecastDataURL)
  // }

  /**
  * singleton get regional forecast data
  */
  // getCountryDeepARPlusForecastData(): Observable<any[]> {
  //   return this.getObservableURL(this.appConfigService.countryDeepARPlusForecastDataURL)
  // }

  /**
   * singleton get regional forecast data
   */
  // getRegionalDeepARPlusForecastData(): Observable<any[]> {
  //   return this.getObservableURL(this.appConfigService.regionalDeepARPlusForecastDataURL)
  // }

  /**
  * singleton get regional data
  */
  getRegionalData(): Observable<any[]> {
    return this.getObservableURL(this.appConfigService.regionalDataSetUrl)
  }

  /**
   * singleton get provincial data
   */
  getProvincialData(): Observable<any[]> {
    return this.getObservableURL(this.appConfigService.provincialDataSetUrl)
  }
  
  getDay(index: number): string {
    return this.days && this.days.length > 0 ? this.days[index % this.days.length] : null
  }

  getDays(): string[] {
    return this.days
  }

}