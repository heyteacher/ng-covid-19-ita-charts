import { Injectable } from '@angular/core';
import moment from 'moment';
import { Series, filterByKey, decodeNAYProvince, getValue, Legend } from "./app.model";
import { DataService } from './data.service';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private dataService: DataService) { }

  /**
   * generate series from country data
   * @param valueKey the key of value
   * @param legend the series legend
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  generateCountrySeries(
    valueKey: string,
    legend: Legend,
    denominatorKey: string = null,
    fnValue: Function = null)
    : Observable<Series> {
    return this.dataService.getCountryData().pipe(
      map(data => this.generateSeries(data, valueKey, legend, denominatorKey, 'data', fnValue))
    )
  }

  /**
   * generate series from regional data data
   * @param regionFilter the region filter applied to data 
   * @param valueKey the key of value
   * @param label the series label
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  generateRegionalSeries(
    regionFilter: string,
    valueKey: string,
    legend: Legend,
    denominatorKey: string = null,
    fnValue: Function = null): Observable<Series> {
    return this.dataService.getRegionalData().pipe(
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => this.generateSeries(data, valueKey, legend, denominatorKey, 'data', fnValue)))
  }

  /**
   * generate series from provincial data data
   * @param regionFilter the region filter applied to data 
   * @param provinceFilter the province filter applied to data 
   * @param valueKey the key of value
   * @param label the series label
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  generateProvincialSeries(
    regionFilter: string,
    provinceFilter: string,
    valueKey: string,
    legend: Legend,
    denominatorKey: string = null,
    fnValue: Function = null
    ): Observable<Series> {
    return this.dataService.getProvincialData().pipe(
      map(data => filterByKey(data, 'denominazione_provincia', decodeNAYProvince(provinceFilter))),
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => this.generateSeries(data, valueKey, legend, denominatorKey, 'data', fnValue)))
  }

  /**
   * generate che country ARIMA Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  generateCountryARIMAForecastSeries(
    quantileKey: string, 
    legend: Legend
    ): Observable<Series> {
    return this.dataService.getCountryARIMAForecastData().pipe(
      map(data => this.generateSeries(data, quantileKey, legend, null, 'date'))
    )
  }

  /**
   * generate che regional ARIMA Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  generateRegionalARIMAForecastSeries(
    regionFilter: string, 
    quantileKey: string, 
    legend: Legend,
    ): Observable<Series> {
    return this.dataService.getRegionalARIMAForecastData().pipe(
      map(data => {
        return filterByKey(data, 'item_id', regionFilter)
      }),
      map(data => {
        return this.generateSeries(data, quantileKey, legend, null, 'date')
      })
    )
  }

  /**
   * generate che country DeepAR+ Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  generateCountryForecastDeepARPlusSeries(
    quantileKey: string, 
    legend: Legend,
    ): Observable<Series> {
    return this.dataService.getCountryDeepARPlusForecastData().pipe(
      map(data => this.generateSeries(data, quantileKey, legend, null, 'date'))
    )
  }

  /**
   * generate che regional DeepAR+ Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  generateRegionalForecastDeepARPlusSeries(
    regionFilter: string, 
    quantile: string, 
    legend: Legend,
  ): Observable<Series> {
    return this.dataService.getRegionalDeepARPlusForecastData().pipe(
      map(data => filterByKey(data, 'item_id', regionFilter)),
      map(data => this.generateSeries(data, quantile, legend, null, 'date'))) 
  }

  /**
   * generate a deries from input data
   * @param inputData the input data array
   * @param valueKey the key of value
   * @param legend the series legend
   * @param denominatorKey the key of denominator
   * @param dateKey the key of date 
   * @param fnValue the function to apply to value
   */
  private generateSeries(
    inputData: any[], 
    valueKey: string, 
    legend: Legend, 
    denominatorKey: string = null, 
    dateKey: string = 'data', 
    fnValue: Function = null
    ): Series {
    const daySeries = (input) => {
      let value = getValue(input, valueKey, denominatorKey);
      return {
        value: fnValue ? fnValue(value) : value,
        name: moment(input[dateKey]).format('DD/MM')
      }
    }
    return {
      name: legend.label,
      series: legend.checked? inputData.map(daySeries): []
    }
  }
}