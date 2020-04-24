import { Injectable } from '@angular/core';
import moment from 'moment';
import { Series, filterData, decode, getPercentageValue } from "./app.model";
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private dataService: DataService) { }

  /**
   * generate series from country data
   * @param valueKey the key of value
   * @param label the series label
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  async generateCountrySeries(
    valueKey: string,
    label: string,
    denominatorKey: string = null,
    fnValue: Function = null)
    : Promise<Series> {
    const countryData = await this.dataService.getCountryData();
    return this.generateSeries(countryData, valueKey, label, denominatorKey, 'data', fnValue)
  }

  /**
   * generate series from regional data data
   * @param regionFilter the region filter applied to data 
   * @param valueKey the key of value
   * @param label the series label
   * @param denominatorKey the key of denominator
   * @param fnValue the function to apply to value
   */
  async generateRegionalSeries(
    regionFilter: string,
    valueKey: string,
    label: string,
    denominatorKey: string = null,
    fnValue: Function = null): Promise<Series> {
    let regionalData = await this.dataService.getRegionalData();
    regionalData = filterData(regionalData, 'denominazione_regione', regionFilter)
    return this.generateSeries(regionalData, valueKey, label, denominatorKey, 'data', fnValue);
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
  async generateProvincialSeries(
    regionFilter: string,
    provinceFilter: string,
    valueKey: string,
    label: string,
    denominatorKey: string = null,
    fnValue: Function = null
    ): Promise<Series> {
    let provincialData = await this.dataService.getProvincialData();
    provincialData = filterData(provincialData, 'denominazione_provincia', decode(provinceFilter))
    provincialData = filterData(provincialData, 'denominazione_regione', regionFilter)
    return this.generateSeries(provincialData, valueKey, label, denominatorKey, 'data', fnValue);
  }

  /**
   * generate che country ARIMA Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  async generateCountryARIMAForecastSeries(
    quantileKey: string, 
    label: string
    ): Promise<Series> {
    let countryForecastData = await this.dataService.getCountryARIMAForecastData();
    return this.generateSeries(countryForecastData, quantileKey, label, null, 'date');
  }

  /**
   * generate che regional ARIMA Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  async generateRegionalARIMAForecastSeries(
    regionFilter: string, 
    quantileKey: string, 
    label: string
    ): Promise<Series> {
    let regionalForecastData = await this.dataService.getRegionalARIMAForecastData();
    regionalForecastData = filterData(regionalForecastData, 'item_id', regionFilter)
    return this.generateSeries(regionalForecastData, quantileKey, label, null, 'date');
  }

  /**
   * generate che country DeepAR+ Forecast
   * @param quantileKey the quantile key
   * @param label the series label
   */
  async generateCountryForecastDeepARPlusSeries(
    quantileKey: string, 
    label: string
    ): Promise<Series> {
    let countryForecastDeepARPlusData = await this.dataService.getCountryDeepARPlusForecastData();
    return this.generateSeries(countryForecastDeepARPlusData, quantileKey, label, null, 'date');
  }

  /**
   * generate che regional DeepAR+ Forecast
   * @param regionFilter  the region filter applied to forecast data
   * @param quantileKey the quantile key
   * @param label the series label
   */
  async generateRegionalForecastDeepARPlusSeries(
    regionFilter: string, 
    quantile: string, 
    label: string): Promise<Series> {
    let regionalForecastDeepARPlusData = await this.dataService.getRegionalDeepARPlusForecastData();
    regionalForecastDeepARPlusData = filterData(regionalForecastDeepARPlusData, 'item_id', regionFilter)
    return this.generateSeries(regionalForecastDeepARPlusData, quantile, label, null, 'date');
  }

  /**
   * generate a deries from input data
   * @param inputData the input data array
   * @param valueKey the key of value
   * @param label the series label
   * @param denominatorKey the key of denominator
   * @param dateKey the key of date 
   * @param fnValue the function to apply to value
   */
  private generateSeries(
    inputData: any[], 
    valueKey: string, 
    label: string, 
    denominatorKey: string = null, 
    dateKey: string = 'data', 
    fnValue: Function = null
    ): Series {
    const daySeries = (input) => {
      let value = getPercentageValue(input, valueKey, denominatorKey);
      return {
        value: fnValue ? fnValue(value) : value,
        name: moment(input[dateKey]).format('DD/MM')
      }
    }
    return {
      name: label,
      series: inputData.map(daySeries)
    }
  }
}