import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { filterByDay, filterByKey, Bar, getValue, decodeNAYProvince } from './app.model';
import moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor(private dataService: DataService) { }

  /**
   * generate conuntry daily numbers
   */
  generateCountryNumbers(): Observable<Bar[]> {
    return this.dataService.getCountryData().pipe(
      map(data => filterByDay(data)),
      map(data => this.generateCountryRegionNumbers(data[0]))
    )
  }

  /**
   * generate regional daily numbers
   * @param regionFilter the filter region applied to data
   */
  generateRegionNumbers(regionFilter: string): Observable<Bar[]> {
    return this.dataService.getRegionalData().pipe(
      map(data => filterByDay(data)),
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => this.generateCountryRegionNumbers(data[0]))
    )
  }

  /**
   * generate province daily numbers
   * @param regionFilter the filter region applied to data
   * @param provinceFilter the filter region applied to data
   */
  generateProvinceNumbers(regionFilter: string, provinceFilter: string): Observable<Bar[]> {
    return this.dataService.getProvincialData().pipe(
      map(data => filterByDay(data)),
      map(data => filterByKey(data, 'denominazione_provincia', decodeNAYProvince(provinceFilter))),
      map(data => filterByKey(data, 'denominazione_regione', regionFilter)),
      map(data => [
        {name: $localize`Total Confirmed`, value: data[0].totale_casi},
        {name: $localize`New Confirmed`, value: data[0].totale_nuovi_casi},
        {name: $localize`Confirmed Rate`, value: `${getValue(data[0],'totale_nuovi_casi', 'totale_casi')} %` },
        {name: $localize`Day`, value: moment(data[0].data).format('ddd D MMM')},
      ])
    )
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
