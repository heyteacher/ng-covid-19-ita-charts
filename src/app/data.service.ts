import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node, getDailyRows, getTree, orderDesc } from "./app.model";
import moment from 'moment';
import { AppConfigService } from './app-config.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countryData: any[]
  private regionalData: any[]
  private provincialData: any[]
  private regionalForecastData: any[]
  private countryForecastData: any[]
  private regionalForecastDeepARPlusData: any[]
  private countryForecastDeepARPlusData: any[]

  private days: string[]

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {

  }

  /**
   * singleton get country data
   */
  async getCountryData(): Promise<any[]> {
    if (!this.countryData) {
      this.countryData = await this.getJson(this.appConfigService.countryDataSetURL)
      this.days = this.countryData.map(e => moment(e.data).format('YYYY-MM-DD')).sort(orderDesc)
    }
    return this.countryData
  }


  getDay(index:number): string {
    return this.days && this.days.length > 0? this.days[index % this.days.length]: null
  }
  
  getDays(): string[] {
    if (!this.days) this.countryData
    return this.days
  }


  /**
   * singleton get regional forecast data
   */
  async getCountryForecastData(): Promise<any[]> {
    if (!this.countryForecastData) {
      this.countryForecastData = await this.getJson(this.appConfigService.countryForecastDataURL)
    }
    return this.countryForecastData
  }

 
  /**
   * singleton get regional forecast data
   */
  async getRegionalForecastData(): Promise<any[]> {
    if (!this.regionalForecastData) {
      this.regionalForecastData = await this.getJson(this.appConfigService.regionalForecastDataURL)
    }
    return this.regionalForecastData
  }


    /**
   * singleton get regional forecast data
   */
  async getCountryForecastDeepARPlusData(): Promise<any[]> {
    if (!this.countryForecastDeepARPlusData) {
      this.countryForecastDeepARPlusData = await this.getJson(this.appConfigService.countryForecastDeepARPlusDataURL)
    }
    return this.countryForecastDeepARPlusData
  }

 
  /**
   * singleton get regional forecast data
   */
  async getRegionalForecastDeepARPlusData(): Promise<any[]> {
    if (!this.regionalForecastDeepARPlusData) {
      this.regionalForecastDeepARPlusData = await this.getJson(this.appConfigService.regionalForecastDeepARPlusDataURL)
    }
    return this.regionalForecastDeepARPlusData
  }

   /**
   * singleton get regional data
   */
  async getRegionalData(): Promise<any[]> {
    this.getCountryData()
    if (!this.regionalData) {
      this.regionalData = await this.getJson(this.appConfigService.regionalDataSetUrl)
    }
    return this.regionalData
  }

  /**
   * singleton get provincial data
   */
  async getProvincialData(): Promise<any[]> {
    if (!this.provincialData) {
      this.provincialData = await this.getJson(this.appConfigService.provincialDataSetUrl)
    }
    return this.provincialData
  }

    /**
   * albero anagrafica regioni province generato dai dati per provincia
   */
  public async getTree(): Promise<Node[]> {
    let data = await this.getJson(this.appConfigService.provincialDataSetUrl);
    return getTree(data)
  }

  /**
   * caricamento dei dati via HTTP
   * @param url path del JSON
   */
  private async getJson(url: string): Promise<any[]> {
    return await this.http.get(url).toPromise() as Promise<any[]>;
  }
}
