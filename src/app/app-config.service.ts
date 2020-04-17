import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  countryDataSetURL:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json'
  regionalDataSetUrl:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json'
  provincialDataSetUrl:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-province.json'

  countryForecastDataURL:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast.json'
  regionalForecastDataURL:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast.json'

  countryForecastDeepARPlusDataURL:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast-Deep_AR_Plus.json'
  regionalForecastDeepARPlusDataURL:string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast-Deep_AR_Plus.json'

  constructor() { }
}
