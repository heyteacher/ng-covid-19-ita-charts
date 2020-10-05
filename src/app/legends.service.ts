import { Injectable } from '@angular/core';
import { Legend, objectify } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class LegendsService {

  legends: Legend[] = [
    { name: 'totale_casi', checked: true, label: $localize`Confirmed`, color: '#aec6cf' },
    { name: 'totale_positivi', checked: true, label: $localize`Current Positive`, color: '#aae3f5' },
    { name: 'deceduti', checked: true, label: $localize`Deaths`, color: '#ff6961' },
    { name: 'ricoverati_con_sintomi', checked: true, label: 'Hospitalized', color: '#aFb3F5'},
    { name: 'terapia_intensiva', checked: true, label: $localize`Intensive Care`, color: '#cb99c9' },

    { name: 'nuovi_tamponi', checked: true, label: $localize`Tests`, color: '#fdfd96' },
    { name: 'nuovi_casi_testati', checked: true, label: $localize`People Tested`, color: '#ffb347' },

    { name: 'totale_nuovi_casi', checked: true, label: $localize`New Confirmed`, color: '#aec6cf' },
    { name: 'variazione_totale_positivi', checked: true, label: $localize`Current Positive`, color: '#aae3f5' },
    { name: 'nuovi_deceduti', checked: true, label: $localize`Deaths`, color: '#ff6961' },
    { name: 'nuovi_ricoverati_con_sintomi', checked: true, label: 'Hospitalized', color: '#aFb3F5'},
    { name: 'nuovi_terapia_intensiva', checked: true, label: $localize`Intensive Care`, color: '#cb99c9' },

  //  { name: 'awsForecastARIMA', checked: true, label: `AWS Forecast ARIMA`, color: '#cb99c9' },
  //  { name: 'awsForecastDeepARPlus', checked: true, label: `AWS Forecast Deep AR+`, color: '#aFb3F5' }
  ];

  legendsDict = this.legends.reduce(objectify, {})


  colorScheme = {
    domain: this.legends.map(elem => elem.color)
  };
}
