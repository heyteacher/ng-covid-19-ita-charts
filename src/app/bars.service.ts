import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bar } from "./app.model";

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private dataService: DataService) { }

   
  /**
   * array dati nazionali
   */
  public async getRegionalBars(keyValue: string, day: string = null, denomKey: string = null): Promise<Bar[]> {
    const data = await this.dataService.getRegionalData();
    return this.buildBars(
      this.dataService.getDailyRows(data,day),
      'denominazione_regione',
      keyValue,
      20,
      denomKey
    )
  }

  public async getProvincialBars(keyValue: string, day: string = null, region: string = null, denomKey: string = null): Promise<Bar[]> {
    let data = await this.dataService.getProvincialData();
    if (region) {
      data = this.dataService.filterData(data, 'denominazione_regione', region)
    }
    return this.buildBars(
      this.dataService.getDailyRows(data, day),
      'denominazione_provincia',
      keyValue,
      20,
      denomKey
    )
  }


  private buildBars(data: any[], keyName: string, keyValue: string, max: number = 20, denomKey:string = null): Bar[] {

    const greaterThanZero = (input) => {
      return input && input.value && input.value > 0
    }
    const bar = (input) => {
      const denomValue = denomKey && input[keyValue] > 0 && input[denomKey] >= 0 ? input[denomKey] : 0
      const value = denomKey == null ? 
        parseFloat(input[keyValue]) : 
        denomValue > 0?
          Math.min((Math.floor((input[keyValue] / denomValue) * 10000) / 100), 100):
          0
      return {
        name: this.dataService.encode(input[keyName]),
        value: value,
      }
    }
    return data.map(bar).filter(greaterThanZero).sort(this.dataService.orderValueDesc).slice(0, max)
  }
}
