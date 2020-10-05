import { Injectable } from '@angular/core';
import moment from 'moment';
import { Series, filterByKey, decodeNAYProvince, getValue, Legend, AggregateEnum } from "./app.model";
import { DataService } from './data.service';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LegendsService } from './legends.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private dataService: DataService, private legendsService: LegendsService) { }

  /**
   * generate series from country data
   * @param valueKey the key of value
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  generateCountrySeries(
    valueKey: string,
    denominatorKey: string = null,
    aggregate: AggregateEnum = AggregateEnum.Day,
    avg: boolean = false,
    fnValue: Function = null)
    : Observable<Series> {
    return this.dataService.getCountryDataObservable().pipe(
      map(data => this.generateSeries(data, valueKey, this.legendsService.legendsDict[valueKey], denominatorKey, 'data', aggregate, avg, fnValue))
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
    denominatorKey: string = null,
    aggregate: AggregateEnum = AggregateEnum.Day,
    avg: boolean = false,
    fnValue: Function = null): Observable<Series> {
    return this.dataService.getRegionalDataObservable().pipe(
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => this.generateSeries(data, valueKey, this.legendsService.legendsDict[valueKey], denominatorKey, 'data', aggregate, avg, fnValue)))
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
    denominatorKey: string = null,
    aggregate: AggregateEnum = AggregateEnum.Day,
    avg: boolean = false,
  ): Observable<Series> {
    return this.dataService.getProvincialDataObservable().pipe(
      map(data => filterByKey(data, 'denominazione_provincia', decodeNAYProvince(provinceFilter))),
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => this.generateSeries(data, valueKey, this.legendsService.legendsDict[valueKey], denominatorKey, 'data', aggregate, avg)))
  }

  /**
   * generate che country ARIMA Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  // generateCountryARIMAForecastSeries(
  //   quantileKey: string,
  //   legend: Legend,
  //   aggregate: AggregateEnum = AggregateEnum.Day,
  // ): Observable<Series> {
  //   return this.dataService.getCountryARIMAForecastData().pipe(
  //     map(data => aggregate == AggregateEnum.Day? this.generateSeries(data, quantileKey, legend, null, 'date', aggregate):{name:"",series:[]})
  //   )
  // }

  /**
   * generate che regional ARIMA Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  // generateRegionalARIMAForecastSeries(
  //   regionFilter: string,
  //   quantileKey: string,
  //   legend: Legend,
  //   aggregate: AggregateEnum = AggregateEnum.Day
  // ): Observable<Series> {
  //   return this.dataService.getRegionalARIMAForecastData().pipe(
  //     map(data => {
  //       return filterByKey(data, 'item_id', regionFilter)
  //     }),
  //     map(data => {
  //       return aggregate == AggregateEnum.Day? this.generateSeries(data, quantileKey, legend, null, 'date'):{name:"",series:[]}
  //     })
  //   )
  // }

  /**
   * generate che country DeepAR+ Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  // generateCountryForecastDeepARPlusSeries(
  //   quantileKey: string,
  //   legend: Legend,
  //   aggregate: AggregateEnum = AggregateEnum.Day
  // ): Observable<Series> {
  //   return this.dataService.getCountryDeepARPlusForecastData().pipe(
  //     map(data => aggregate == AggregateEnum.Day? this.generateSeries(data, quantileKey, legend, null, 'date'):{name:"",series:[]})
  //   )
  // }

  /**
   * generate che regional DeepAR+ Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  // generateRegionalForecastDeepARPlusSeries(
  //   regionFilter: string,
  //   quantile: string,
  //   legend: Legend,
  //   aggregate: AggregateEnum = AggregateEnum.Day
  // ): Observable<Series> {
  //   return this.dataService.getRegionalDeepARPlusForecastData().pipe(
  //     map(data => filterByKey(data, 'item_id', regionFilter)),
  //     map(data => aggregate == AggregateEnum.Day? this.generateSeries(data, quantile, legend, null, 'date'):{name:"",series:[]}))
  // }

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
    aggregate: AggregateEnum = AggregateEnum.Day,
    avg: boolean = false,
    fnValue: Function = null
  ): Series {
    const daySeries = (input) => {
      let value = getValue(input, valueKey, denominatorKey);
      return {
        value: fnValue ? fnValue(value) : value,
        name: moment(input[dateKey]).toDate()
      }
    }
    const aggregateSeries = (accumulator: any, input: any) => {
      let aggregateKey = moment(input[dateKey]).format('DD/MM/YYYY')
      switch (aggregate) {
        case AggregateEnum.Week:
          aggregateKey = moment(input[dateKey]).format('w/YYYY')
          break;
        case AggregateEnum.Month:
          aggregateKey = moment(input[dateKey]).format('MM/YYYY')
          break;
        default:
          break;
      }
      if (!accumulator[aggregateKey]) {
        accumulator[aggregateKey] = {}
        accumulator[aggregateKey][dateKey] = input[dateKey]
        accumulator[aggregateKey][valueKey] = 0
        if (denominatorKey) {
          accumulator[aggregateKey][denominatorKey] = 0
        }
        accumulator[aggregateKey]['aggregate_count'] = 0
      }
      accumulator[aggregateKey]['aggregate_count'] += 1
      const addAverage = (oldAvg, newValue, size) => {
        return oldAvg + ((newValue - oldAvg) / size)
      }
      accumulator[aggregateKey][valueKey] = avg ?
        addAverage(
          accumulator[aggregateKey][valueKey],
          input[valueKey],
          accumulator[aggregateKey]['aggregate_count']
        ) :
        accumulator[aggregateKey][valueKey] + input[valueKey]
      if (denominatorKey) {
        accumulator[aggregateKey][denominatorKey] = avg ?
          addAverage(
            accumulator[aggregateKey][denominatorKey],
            input[denominatorKey],
            accumulator[aggregateKey]['aggregate_count']) :
          accumulator[aggregateKey][denominatorKey] + input[denominatorKey]
      }
      return accumulator
    }

    return {
      name: legend.label,
      key: legend.name,
      series: legend.checked ? Object.values(inputData.reduce(aggregateSeries, {})).map(daySeries) : []
    }
  }
}