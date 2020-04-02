import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node } from "./app.model";
import moment from 'moment';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countryData: any[]
  private regionalData: any[]
  private provincialData: any[]
  private regionalForecastData: any[]
  private countryForecastData: any[]

  private days: string[]

  constructor(private http: HttpClient) {

  }

  /**
   * singleton get country data
   */
  async getCountryData(): Promise<any[]> {
    if (!this.countryData) {
      this.countryData = await this.getJson(environment.countryDataSetURL)
      this.days = this.countryData.map(e => moment(e.data).format('YYYY-MM-DD')).sort(this.orderDesc)
    }
    return this.countryData
  }


  getDay(index:number): string {
    return this.days && this.days.length > 0? this.days[index % this.days.length]: null
  }
  
  getDays(): string[] {
    if (!this.days) this.getCountryData()
    return this.days
  }


  /**
   * singleton get regional forecast data
   */
  async getCountryForecastData(): Promise<any[]> {
    if (!this.countryForecastData) {
      this.countryForecastData = await this.getJson(environment.countryForecastDataURL)
    }
    return this.countryForecastData
  }

  /**
   * singleton get regional data
   */
  async getRegionalData(): Promise<any[]> {
    if (!this.regionalData) {
      this.regionalData = await this.getJson(environment.regionalDataSetUrl)
    }
    return this.regionalData
  }

  /**
   * singleton get regional forecast data
   */
  async getRegionalForecastData(): Promise<any[]> {
    if (!this.regionalForecastData) {
      this.regionalForecastData = await this.getJson(environment.regionalForecastDataURL)
    }
    return this.regionalForecastData
  }

  /**
   * singleton get provincial data
   */
  async getProvincialData(): Promise<any[]> {
    if (!this.provincialData) {
      this.provincialData = await this.getJson(environment.provincialDataSetUrl)
    }
    return this.provincialData
  }

    /**
   * albero anagrafica regioni province generato dai dati per provincia
   */
  public async getTree(): Promise<Node[]> {
    const tree: Node[] = [{
      name: 'Italia',
      uri: '/',
      children: []
    }];
    let data = await this.getJson(environment.provincialDataSetUrl);
    data = this.getDailyRows(data);
    let regions = {}
    for (const row of data) {
      const region = row.denominazione_regione
      if (!regions[region]) {
        // aggiungo nuova regione (gestione Bolzano e Trento)
        regions[region] = {
          uri: `/${region}`,
          name: region,
          children: []
        }
        tree[0].children.push(regions[region])
      }
      // aggiungo provincia, gestendo i Non Assegnati (gigla vuota)
      const province = this.encode(row.denominazione_provincia)
      regions[region].children.push({
        uri: `/${region}/${province}`,
        name: province
      });
    }
    return tree
  }

  /**
   * filtro dei dati per il valore della chiave selezionata
   * @param data[] array dei dati 
   * @param key la chiave 
   * @param value il valore da filtrare
   */
  filterData(data: any[], key: string, value: string) {
    const filterSeries = (input) => {
      return input[key].match(new RegExp('^'+value, 'i'));
    }
    return data.filter(filterSeries)
  }

  getDailyRows(data: any[], day: string = null): any[] {
    if (day) {
      return this.filterData(data, 'data', day)
    }
    return this.filterData(data, 'data', data[data.length - 1].data)
  }

  encode(province) {
    return province == 'In fase di definizione/aggiornamento' ? `N.A.` : province
  }

  decode(province) {
    return province == 'N.A.' ? 'In fase di definizione/aggiornamento' : province
  }

  orderValueDesc = (a, b) => {
    return a.value > b.value ? -1 : 1

  }
  orderDesc = (a,b) => {
    return a > b ? -1 : 1
  }

  /**
   * caricamento dei dati via HTTP
   * @param url path del JSON
   */
  private async getJson(url: string): Promise<any[]> {
    return await this.http.get(url).toPromise() as Promise<any[]>;
  }



}
