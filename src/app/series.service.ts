import { Injectable } from '@angular/core';
import moment from 'moment';
import { Series } from "./app.model";
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private dataService: DataService) { }

  /**
   * array dati nazionali
   */
  async getCountrySeries(key: string, label: string, denomKey: string = null): Promise<Series> {
    const countryData = await this.dataService.getCountryData();
    return this.buildSeries(countryData, key, label, denomKey)
  }


    /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getCountryForecastSeries(label: string): Promise<Series> {
    let countryForecastData = await this.dataService.getCountryForecastData();
    return this.buildSeries(countryForecastData, 'p90', label, null, 'date');
  }

  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getRegionalSeries(region: string, key: string, label: string, denomKey: string = null): Promise<Series> {
    let regionalData = await this.dataService.getRegionalData();
    regionalData = this.dataService.filterData(regionalData, 'denominazione_regione', region)
    return this.buildSeries(regionalData, key, label, denomKey);
  }

  /**
   * array dati regionali filtrati per regione
   * @param region  regione
   */
  async getRegionalForecastSeries(region: string, label: string): Promise<Series> {
    let regionalForecastData = await this.dataService.getRegionalForecastData();
    regionalForecastData = this.dataService.filterData(regionalForecastData, 'item_id', region)
    return this.buildSeries(regionalForecastData, 'p90', label, null, 'date');
  }

  /**
   * array dati provinciali filtrati per provincia
   * @param province provincia
   */
  async getProvincialSeries(region: string, province: string, key: string, label: string, denomKey: string = null): Promise<Series> {
    let provincialData = await this.dataService.getProvincialData();
    provincialData = this.dataService.filterData(provincialData, 'denominazione_provincia', this.dataService.decode(province))
    provincialData = this.dataService.filterData(provincialData, 'denominazione_regione', region)
    return this.buildSeries(provincialData, key, label, denomKey);
  }

   /**
   * genera ila serie nel formato richiesto da ngx-charts
   * @param data array dei dati
   * @param key chiave per estrarre il valore
   * @param label descrizione della chiava
   */
  private buildSeries(data: any[], key: string, label: string, denomKey: string = null, date:string = 'data'): Series {
    const daySeries = (input) => {
      const denomValue = denomKey && input[denomKey] > 0 && input[key] >= 0 ? input[denomKey] : 0
      const value = denomKey == null ? 
        input[key] : 
        denomValue > 0?
          Math.min((Math.floor((input[key] / denomValue) * 10000) / 100), 100):
          0
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
