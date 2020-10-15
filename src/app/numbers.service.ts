import { Injectable} from '@angular/core';
import { DataService } from './data.service';
import { filterByDay, filterByKey, Bar, getValue, decodeNAYProvince } from './app.model';
import moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LegendsService } from './legends.service';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor(
    private dataService: DataService, private legendsService: LegendsService) { 
      moment.locale(document.documentElement.lang)
    }

  /**
   * generate conuntry daily numbers
   */
  generateCountryNumbers(): Bar[] {
    return this.generateCountryRegionNumbers(this.dataService.getDailyCountryData())
  }

  /**
   * generate regional daily numbers
   * @param regionFilter the filter region applied to data
   */
  generateRegionNumbers(regionFilter: string): Bar[] {
    return this.generateCountryRegionNumbers(
      filterByKey(
        this.dataService.getDailyRegionalData(),'denominazione_regione', regionFilter
      )[0]
    )
  }

  /**
   * generate province daily numbers
   * @param regionFilter the filter region applied to data
   * @param provinceFilter the filter region applied to data
   */
  generateProvinceNumbers(regionFilter: string, provinceFilter: string): Bar[] {
    const  data = 
      filterByKey(
        filterByKey(
          this.dataService.getDailyProvincialData(), 
          'denominazione_provincia', 
          decodeNAYProvince(provinceFilter)
        ), 
        'denominazione_regione', 
        regionFilter)
      return [
        {name: $localize`Today`, value: moment(data[0].data).format('ddd D MMMM'), color: '#607d8b'},
        {name: $localize`Total Confirmed`, value: data[0].totale_casi , color: this.legendsService.legendsDict['totale_casi'].color},
        {name: $localize`New Confirmed`, value: data[0].totale_nuovi_casi, color: this.legendsService.legendsDict['totale_nuovi_casi'].color},
      ]
  }

  /**
   * generate numbers from country region row data
   * @param row the data row where extract numbers
   */
  private generateCountryRegionNumbers(row: any): Bar[] {
    return [
      {name: $localize`Today`, value: moment(row.data).format('ddd D MMMM'), color: '#607d8b'},
      {name: $localize`Confirmed`, value: row.totale_nuovi_casi, color: this.legendsService.legendsDict['totale_nuovi_casi'].color},
      {name: $localize`Hospitalized`, value: row.nuovi_ricoverati_con_sintomi, color: this.legendsService.legendsDict['nuovi_ricoverati_con_sintomi'].color},
      {name: $localize`Intensive Care`, value: row.nuovi_terapia_intensiva, color: this.legendsService.legendsDict['nuovi_terapia_intensiva'].color},
      {name: $localize`Deaths` , value: row.nuovi_deceduti, color: this.legendsService.legendsDict['nuovi_deceduti'].color},
      {name: $localize`Current Positive`, value: row.variazione_totale_positivi, color: this.legendsService.legendsDict['variazione_totale_positivi'].color},
    ]
  }
}
