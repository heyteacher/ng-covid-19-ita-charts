// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  shareUrl: "http://localhost:4200",
  shareTags: "SHARE TAGS",
  
  baseHref: "/",

  otherLang: {
    url: "/it/",
    label: "IT"
  },



  countryDataSetURL: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json',
  regionalDataSetUrl: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json',
  provincialDataSetUrl: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json/dpc-covid19-ita-province.json',

  countryForecastDataURL: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast.json',
  regionalForecastDataURL: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast.json',
  
  countryForecastDeepARPlusDataURL: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-andamento-nazionale-forecast-Deep_AR_Plus.json',
  regionalForecastDeepARPlusDataURL: 'https://raw.githubusercontent.com/heyteacher/COVID-19/master/dati-json-forecast/covid19-ita-regioni-forecast-Deep_AR_Plus.json',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
