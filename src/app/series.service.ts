import { Injectable } from '@angular/core';
import moment from 'moment';
import { Series, filterData,decode } from "./app.model";
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private dataService: DataService) { }

  /**
   * array dati nazionali
   */
  async getCountrySeries(
      key: string, 
      label: string, 
      denomKey: string = null, 
      fn:Function = null): Promise<Series> {
    const countryData = await this.dataService.getCountryData();
    return this.buildSeries(countryData, key, label, denomKey, 'data', fn)
  }


  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getRegionalSeries(
    region: string, 
    key: string, 
    label: string, 
    denomKey: string = null,
    fn:Function = null): Promise<Series> {
    let regionalData = await this.dataService.getRegionalData();
    regionalData = filterData(regionalData, 'denominazione_regione', region)
    return this.buildSeries(regionalData, key, label, denomKey,'data',fn);
  }

  /**
   * array dati provinciali filtrati per provincia
   * @param province provincia
   */
  async getProvincialSeries(
    region: string, 
    province: string, 
    key: string, 
    label: string, 
    denomKey: string = null,
    fn:Function = null): Promise<Series> {
    let provincialData = await this.dataService.getProvincialData();
    provincialData = filterData(provincialData, 'denominazione_provincia', decode(province))
    provincialData = filterData(provincialData, 'denominazione_regione', region)
    return this.buildSeries(provincialData, key, label, denomKey,'data',fn);
  }

  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getCountryForecastSeries(quantile: string, label: string): Promise<Series> {
    let countryForecastData = await this.dataService.getCountryForecastData();
    return this.buildSeries(countryForecastData, quantile, label, null, 'date');
  }
  
  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getRegionalForecastSeries(region: string, quantile:string, label: string): Promise<Series> {
    let regionalForecastData = await this.dataService.getRegionalForecastData();
    regionalForecastData = filterData(regionalForecastData, 'item_id', region)
    return this.buildSeries(regionalForecastData, quantile, label, null, 'date');
  }

    /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getCountryForecastDeepARPlusSeries(quantile: string, label: string): Promise<Series> {
    let countryForecastDeepARPlusData = await this.dataService.getCountryForecastDeepARPlusData();
    return this.buildSeries(countryForecastDeepARPlusData, quantile, label, null, 'date');
  }
  
  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getRegionalForecastDeepARPlusSeries(region: string, quantile:string, label: string): Promise<Series> {
    let regionalForecastDeepARPlusData = await this.dataService.getRegionalForecastDeepARPlusData();
    regionalForecastDeepARPlusData = filterData(regionalForecastDeepARPlusData, 'item_id', region)
    return this.buildSeries(regionalForecastDeepARPlusData, quantile, label, null, 'date');
  }

   /**
   * genera ila serie nel formato richiesto da ngx-charts
   * @param data array dei dati
   * @param key chiave per estrarre il valore
   * @param label descrizione della chiava
   */
  private buildSeries(data: any[], key: string, label: string, denomKey: string = null, date:string = 'data', fn:Function = null): Series {
    const daySeries = (input) => {
      const denomValue = denomKey && input[denomKey] > 0 && input[key] != 0 ? input[denomKey] : 0
      let value = denomKey == null ? 
        input[key] : 
        denomValue > 0?
          Math.min((Math.floor((input[key] / denomValue) * 10000) / 100), 100):
          0
      value = fn? fn(value): value
      return {
        value: value,
        name: moment(input[date]).format('DD/MM')
      }
    }
    return {
      name: label,
      series: data.map(daySeries)
    }
  }
}
