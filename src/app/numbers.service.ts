import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { filterByDay, filterByKey, Bar, getValue, encodeNAYProvince, decodeNAYProvince } from './app.model';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor(private dataService: DataService) { }

  /**
   * generate conuntry daily numbers
   */
  async generateCountryNumbers(): Promise<Bar[]> {
    let countryData = await this.dataService.getCountryData()
    countryData = filterByDay(countryData)
    return this.generateCountryRegionNumbers(countryData[0])
  }

  /**
   * generate regional daily numbers
   * @param regionFilter the filter region applied to data
   */
  async generateRegionNumbers(regionFilter: string): Promise<Bar[]> {
    let regionalData = await this.dataService.getRegionalData()
    regionalData = filterByDay(regionalData)
    regionalData = filterByKey(regionalData, 'denominazione_regione', regionFilter)
    return this.generateCountryRegionNumbers(regionalData[0])
  }

  /**
   * generate province daily numbers
   * @param regionFilter the filter region applied to data
   * @param provinceFilter the filter region applied to data
   */
  async generateProvinceNumbers(regionFilter: string, provinceFilter: string): Promise<Bar[]> {
    let data = await this.dataService.getProvincialData()
    data = filterByDay(data)
    data = filterByKey(data, 'denominazione_provincia', decodeNAYProvince(provinceFilter))
    data = filterByKey(data, 'denominazione_regione', regionFilter)
    return [
      {name: $localize`Total Confirmed`, value: data[0].totale_casi},
      {name: $localize`New Confirmed`, value: data[0].totale_nuovi_casi},
      {name: $localize`Confirmed Rate`, value: `${getValue(data[0],'totale_nuovi_casi', 'totale_casi')} %` },
      {name: $localize`Day`, value: moment(data[0].data).format('ddd D MMM')},
    ]
  }


  /**
   * generate numbers from country region row data
   * @param row the data row where extract numbers
   */
  private generateCountryRegionNumbers(row: any): Bar[] {
    return [
      {name: $localize`Confirmed`, value: row.totale_nuovi_casi},
      {name: $localize`Recovered/Released`, value: row.nuovi_dimessi_guariti},
      {name: $localize`Intensive Care`, value: row.nuovi_terapia_intensiva},
      {name: $localize`Deaths` , value: row.nuovi_deceduti},
      {name: $localize`Current Positive`, value: row.variazione_totale_positivi},
      {name: $localize`Day`, value: moment(row.data).format('ddd D MMM')},
    ]
  }
}
