import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node, filterByDay, generateRegionProvinceTree, orderDesc } from "./app.model";
import moment from 'moment';
import { AppConfigService } from './app-config.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countryData: any[]
  private regionalData: any[]
  private provincialData: any[]
  private regionalARIMAForecastData: any[]
  private countryARIMAForecastData: any[]
  private regionalDeepARPlusForecastData: any[]
  private countryDeepARPlusForecastData: any[]

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


  getDay(index: number): string {
    return this.days && this.days.length > 0 ? this.days[index % this.days.length] : null
  }

  getDays(): string[] {
    if (!this.days) this.countryData
    return this.days
  }


  /**
   * singleton get regional forecast data
   */
  async getCountryARIMAForecastData(): Promise<any[]> {
    if (!this.countryARIMAForecastData) {
      this.countryARIMAForecastData = await this.getJson(this.appConfigService.countryARIMAForecastDataURL)
    }
    return this.countryARIMAForecastData
  }


  /**
   * singleton get regional forecast data
   */
  async getRegionalARIMAForecastData(): Promise<any[]> {
    if (!this.regionalARIMAForecastData) {
      this.regionalARIMAForecastData = await this.getJson(this.appConfigService.regionalARIMAForecastDataURL)
    }
    return this.regionalARIMAForecastData
  }

  /**
  * singleton get regional forecast data
  */
  async getCountryDeepARPlusForecastData(): Promise<any[]> {
    if (!this.countryDeepARPlusForecastData) {
      this.countryDeepARPlusForecastData = await this.getJson(this.appConfigService.countryDeepARPlusForecastDataURL)
    }
    return this.countryDeepARPlusForecastData
  }


  /**
   * singleton get regional forecast data
   */
  async getRegionalDeepARPlusForecastData(): Promise<any[]> {
    if (!this.regionalDeepARPlusForecastData) {
      this.regionalDeepARPlusForecastData = await this.getJson(this.appConfigService.regionalDeepARPlusForecastDataURL)
    }
    return this.regionalDeepARPlusForecastData
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
    return generateRegionProvinceTree(data)
  }

  /**
   * caricamento dei dati via HTTP
   * @param url path del JSON
   */
  private async getJson(url: string): Promise<any[]> {
    return await this.http.get(url).toPromise() as Promise<any[]>;
  }
}
