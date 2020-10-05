import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node, generateRegionProvinceTree, orderDesc, filterByDay } from "./app.model";
import moment from 'moment';
import { AppConfigService } from './app-config.service';
import { Observable, Subject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

interface ObservableURLDictionary<T> {
  [Key: string]: T;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _observableURLDictionary: ObservableURLDictionary<Observable<any[]>> = {}
  private _dailyCountryData = {}
  private _dailyRegionalData = []
  private _dailyProvincialData = []
  private _days: string[]

  constructor(private httpClient: HttpClient, private appConfigService: AppConfigService) {
    this.getCountryDataObservable().subscribe((data) => {
      this._days = data.map(e => moment(e.data).format('YYYY-MM-DD')).sort(orderDesc)
      this._dailyCountryData = filterByDay(data)[0]
    })
    this.getRegionalDataObservable().subscribe((data) => {
      this._dailyRegionalData = filterByDay(data)
    })
    this.getProvincialDataObservable().subscribe((data) => {
      this._dailyProvincialData = filterByDay(data)
    })
  }

  /**
   * singleton get country data
   */
  getCountryDataObservable(): Observable<any[]> {
    return this._getURLObservable(this.appConfigService.countryDataSetURL)
  }

  getDailyCountryData(): any {
    return this._dailyCountryData
  }

  /**
  * singleton get regional data
  */
  getRegionalDataObservable(): Observable<any[]> {
    return this._getURLObservable(this.appConfigService.regionalDataSetUrl)
  }

  getDailyRegionalData(): any[] {
    return this._dailyRegionalData
  }

  /**
   * singleton get provincial data
   */
  getProvincialDataObservable(): Observable<any[]> {
    return this._getURLObservable(this.appConfigService.provincialDataSetUrl)
  }

  getDailyProvincialData(): any[] {
    return this._dailyProvincialData
  }

  getDay(index: number): string {
    return this._days && this._days.length > 0 ? this._days[index % this._days.length] : null
  }

  getDays(): string[] {
    return this._days
  }

  /**
   * caricamento dei dati via HTTP
   * @param url path del JSON
   */
  private _getURLObservable(url: string): Observable<any[]> {
    if (!this._observableURLDictionary[url]) {
      this._observableURLDictionary[url] = this.httpClient.get<any[]>(url).pipe(shareReplay())
    }
    return this._observableURLDictionary[url]
  }
}