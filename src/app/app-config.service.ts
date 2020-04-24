export class AppConfigService {

  daysToShowInBars: number = 30

  countryDataSetURL: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json'
  regionalDataSetUrl: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json'
  provincialDataSetUrl: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-province.json'

  countryARIMAForecastDataURL: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast.json'
  regionalARIMAForecastDataURL: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast.json'

  countryDeepARPlusForecastDataURL: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast-Deep_AR_Plus.json'
  regionalDeepARPlusForecastDataURL: string = 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast-Deep_AR_Plus.json'

  constructor() { }
}
