import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { filterByDay, filterByKey, Bar } from './app.model';
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
    return this.generateNumbers(countryData[0])
  }

  /**
   * generate regional daily numbers
   * @param region the filter region applied to data
   */
  async generateRegionNumbers(region: string): Promise<Bar[]> {
    let regionalData = await this.dataService.getRegionalData()
    regionalData = filterByDay(regionalData)
    regionalData = filterByKey(regionalData, 'denominazione_regione', region)
    return this.generateNumbers(regionalData[0])
  }

  /**
   * generate numbers from row data
   * @param row the data row where extract numbers
   */
  private generateNumbers(row: any): Bar[] {
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
