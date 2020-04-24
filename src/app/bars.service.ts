import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bar, getDailyRows, filterData, orderValueDesc, encode, getValue, getMaxValue } from "./app.model";
import { AppConfigService } from './app-config.service';

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
   * @returns promise of tuple with bar array and max value
   */
  public async generateRegionalBars(
    keyValue: string,
    filterDay: string = null,
    denominatorKey: string = null
  ): Promise<[Bar[], number]> {
    const data = await this.dataService.getRegionalData();
    const bars = this.generateBars(
      getDailyRows(data, filterDay),
      'denominazione_regione',
      keyValue,
      20,
      denominatorKey
    )
    const max: number = getMaxValue(data, keyValue, denominatorKey,this.appConfigService.daysToShowInBars)
    return [bars, max]
  }

  /**
   * generate bars with `keyValue` from provincial data filtered by `day` (if set) and `region` (if set), divided by `denominatorKey` value (if set)
   * @param keyValue the key of value to extract
   * @param filterDay the filter day
   * @param filterRegion the filter region
   * @param denominatorKey the key of denominator
   * @returns promise of tuple with bar array and max value
   */
  public async generateProvincialBars(
    keyValue: string,
    filterDay: string = null,
    filterRegion: string = null,
    denomKey: string = null
  ): Promise<[Bar[], number]> {
    let data = await this.dataService.getProvincialData();
    if (filterRegion) {
      data = filterData(data, 'denominazione_regione', filterRegion)
    }
    const bars: Bar[] = this.generateBars(
      getDailyRows(data, filterDay),
      'denominazione_provincia',
      keyValue,
      20,
      denomKey
    )
    const max: number = getMaxValue(data, keyValue, denomKey,this.appConfigService.daysToShowInBars)
    return [bars, max]
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
        name: encode(input[keyName]),
        value: getValue(input, keyValue, denomKey),
      }
    }
    return inputData.map(bar).filter(greaterThanZero).sort(orderValueDesc).slice(0, limit)
  }
}
