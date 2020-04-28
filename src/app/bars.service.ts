import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bar, filterByDay, filterByKey, orderValueDesc, encodeNAYProvince, getValue, getMaxValue } from "./app.model";
import { AppConfigService } from './app-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private dataService: DataService, private appConfigService: AppConfigService) { }

  /**
   * generate bars with `keyValue` from regional data filtered by `day` (if set), divided by `denominatorKey` value (if set)
   * @param keyValue the key of value to extract
   * @param filterDay the filter day
   * @param denominatorKey the key of denominator
   * @returns tuple with bar array and max value
   */
  public generateRegionalBars(
    keyValue: string,
    filterDay: string = null,
    denominatorKey: string = null
  ):Observable<[Bar[], number]> {
    return this.dataService.getRegionalData()
    .pipe(
      map((data: any[]) => filterByDay(data, filterDay)),
      map((data: any[]) => [
        this.generateBars(
          data,
          'denominazione_regione',
          keyValue,
          20,
          denominatorKey)
        ,
        getMaxValue(data, keyValue, denominatorKey,this.appConfigService.daysToShowInBars)
      ]
    ))
  }

  /**
   * generate bars with `keyValue` from provincial data filtered by `day` (if set) and `region` (if set), divided by `denominatorKey` value (if set)
   * @param keyValue the key of value to extract
   * @param filterDay the filter day
   * @param filterRegion the filter region
   * @param denominatorKey the key of denominator
   * @returns tuple with bar array and max value
   */
  public generateProvincialBars(
    keyValue: string,
    filterDay: string = null,
    filterRegion: string = null,
    denomKey: string = null
  ): Observable<[Bar[], number]> {
    return this.dataService.getProvincialData()
    .pipe(
      map((data: any[]) => filterRegion?filterByKey(data, 'denominazione_regione', filterRegion): data),
      map((data: any[]) => filterByDay(data, filterDay)),
      map((data: any[]) => [
        this.generateBars(
          data,
          'denominazione_provincia',
          keyValue,
          20,
          denomKey)
        ,
        getMaxValue(data, keyValue, denomKey,this.appConfigService.daysToShowInBars)
      ]
    ))
  }

  /**
   * generate bars from `data`, skipping zero values, desc ordered limited to `limit`
   * @param inputData the inputData
   * @param keyName the bar name
   * @param keyValue the bar value
   * @param limit the bar limit
   * @param denomKey the denominator key of value
   * @returns Bar array generated
   */
  private generateBars(
    inputData: any[],
    keyName: string,
    keyValue: string,
    limit: number = 20,
    denomKey: string = null
  ): Bar[] {
    const greaterThanZero = (input) => {
      return input && input.value && input.value != 0
    }
    const bar = (input) => {
      return {
        name: encodeNAYProvince(input[keyName]),
        value: getValue(input, keyValue, denomKey),
      }
    }
    return inputData.map(bar).filter(greaterThanZero).sort(orderValueDesc).slice(0, limit)
  }
}
