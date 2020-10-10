import { Component } from '@angular/core';
import { SeriesService } from '../series.service';
import { ActivatedRoute } from '@angular/router';
import { Bar, Series, AggregateEnum as AggregateEnum, ScaleEnum, ColorScheme } from '../app.model';
import { BarsService } from '../bars.service';
import { NumbersService } from '../numbers.service';
import { forkJoin } from 'rxjs';
import { formatNumber } from '@angular/common';
import { LegendsService } from '../legends.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent {
  breadcrumbs: any;

  seriesData: Series[] = [];
  seriesColorScheme: ColorScheme = { domain: [] }

  seriesDailyData: Series[] = [];
  seriesDailyColorScheme: ColorScheme = { domain: [] }

  seriesIntensiveCareData: Series[] = [];
  seriesIntensiveCareColorScheme: ColorScheme = { domain: [] }


  seriesHospitalizedData: Series[] = [];
  seriesHospitalizedColorScheme: ColorScheme = { domain: [] }

  seriesCasesPerPeopleTestedRateData: Series[] = [];
  seriesCasesPerPeopleTestedRateColorScheme: ColorScheme = { domain: [] }

  seriesSwabData: Series[];
  seriesSwabColorScheme: ColorScheme = { domain: [] }

  totalCasesBarsData: Bar[] = [];
  totalCasesBarsMax: number;

  intensiveBarsData: Bar[] = [];
  intensiveBarsMax: number;

  hospitalizedBarsData: Bar[] = [];
  hospitalizedBarsMax: number;

  newPositiveBarsData: Bar[];
  newPositiveBarsMax: number;

  dailyCasesPerProvinceBarsData: Bar[] = [];
  dailyCasesPerProvinceBarsMax: number;

  totalSwabBarsData: Bar[] = []
  totalSwabBarsMax: number;


  lethalityBarsData: Bar[] = []
  lethalityBarsMax: number;

  dailyDeathBarsData: Bar[] = []
  dailyDeathBarsMax: number;

  deathBarsData: Bar[] = []
  deathBarsMax: number;

  casesPerPeopleTestedBarsData: Bar[] = []
  casesPerPeopleTestedBarsMax: number;

  newSwabBarsData: Bar[] = [];
  newSwabBarsMax: number;

  numbersData: Bar[] = [];
  numbersServiceColorScheme: ColorScheme = { domain: [] }

  showLegend: boolean
  legendsService: LegendsService

  log10: boolean = true
  private aggregateCasesPerPeopleTestedRate: AggregateEnum

  constructor(
    private seriesService: SeriesService,
    private barsService: BarsService,
    private numbersService: NumbersService,
    private dataService: DataService,
    legendsService: LegendsService,
    activateRoute: ActivatedRoute
  ) {
    this.legendsService = legendsService
    activateRoute.params.subscribe(params => {
      this.breadcrumbs = params
      this.initData()
    })
  }

  private initData() {
    if (this.breadcrumbs['province']) {
      this.setProvincialData(this.breadcrumbs.region, this.breadcrumbs.province)
    }
    else if (this.breadcrumbs['region']) {
      this.setRegionalData(this.breadcrumbs.region)
    }
    else {
      this.setCountryData()
    }
  }

  private setCountryData() {
    const log10fn = this.log10 ? ((n) => n && n > 0 ? Math.log10(n) : n) : null
    forkJoin([
      this.seriesService.generateCountrySeries('totale_casi', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateCountrySeries('totale_positivi', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateCountrySeries('deceduti', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateCountrySeries('ricoverati_con_sintomi', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateCountrySeries('terapia_intensiva', null, AggregateEnum.Day, true, log10fn),
    ])
      .subscribe(data => {
        this.seriesColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesData = data
        this.numbersData = this.numbersService.generateCountryNumbers()
        this.numbersServiceColorScheme = { domain: this.numbersData.map(bar => bar.color) }
      })

    forkJoin([
      this.seriesService.generateCountrySeries("totale_nuovi_casi", null, AggregateEnum.Day),
      this.seriesService.generateCountrySeries('variazione_totale_positivi', null, AggregateEnum.Day),
      this.seriesService.generateCountrySeries('nuovi_deceduti', null, AggregateEnum.Day),
      this.seriesService.generateCountrySeries('nuovi_ricoverati_con_sintomi', null, AggregateEnum.Day, true),
    ])
      .subscribe(data => {
        this.seriesDailyColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesDailyData = data
      })

    this.seriesService.generateCountrySeries('terapia_intensiva', null, AggregateEnum.Day, true)
      .subscribe(data => {
        this.seriesIntensiveCareColorScheme = {
          domain: [this.legendsService.legendsDict[data.key].color]
        }
        this.seriesIntensiveCareData = [data]
      })

    this.seriesService.generateCountrySeries('ricoverati_con_sintomi', null, AggregateEnum.Day, true)
      .subscribe(data => {
        this.seriesHospitalizedColorScheme = {
          domain: [this.legendsService.legendsDict[data.key].color]
        }
        this.seriesHospitalizedData = [data]
      })

    this.seriesService.generateCountrySeries('totale_nuovi_casi', 'nuovi_casi_testati', this.aggregateCasesPerPeopleTestedRate, false)
      .subscribe(data => {
        this.seriesCasesPerPeopleTestedRateColorScheme = {
          domain: [this.legendsService.legendsDict.totale_nuovi_casi_nuovi_casi_testati.color]
        }
        this.seriesCasesPerPeopleTestedRateData = [data]
      })

    forkJoin([
      this.seriesService.generateCountrySeries('nuovi_tamponi', null, AggregateEnum.Day),
      this.seriesService.generateCountrySeries('nuovi_casi_testati', null, AggregateEnum.Day)
    ])
      .subscribe(data => {
        this.seriesSwabColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesSwabData = data
      })

    this.dataService.getRegionalDataObservable().subscribe(data => {
      this.dataService.getProvincialDataObservable().subscribe(data => {
        this.getIntensiveBarsData()
        this.getHospitalizedBarsData()
        this.getNewPositiveBarsData()

        this.getLethalityBarsData()
        this.getDailyDeathBarsData()
        this.getDeathBarsData()

        this.getCasesPerPeopleTestedBarsData()
        this.getTotalCasesBarsData()
        this.getDailyCasesPerProvinceBarsData()

        this.getTotalSwabBarsData()
        this.getNewSwabBarsData()
      })
    })
  }

  private setRegionalData(region: string) {
    const log10fn = this.log10 ? ((n) => n && n > 0 ? Math.log10(n) : n) : null
    forkJoin([
      this.seriesService.generateRegionalSeries(region, 'totale_casi', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateRegionalSeries(region, 'terapia_intensiva', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateRegionalSeries(region, 'deceduti', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateRegionalSeries(region, 'ricoverati_con_sintomi', null, AggregateEnum.Day, true, log10fn),
      this.seriesService.generateRegionalSeries(region, 'totale_positivi', null, AggregateEnum.Day, true, log10fn),
    ])
      .subscribe(data => {
        this.seriesColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesData = data
        this.numbersData = this.numbersService.generateRegionNumbers(region)
        this.numbersServiceColorScheme = { domain: this.numbersData.map(bar => bar.color) }
      })

    forkJoin([
      this.seriesService.generateRegionalSeries(region, "totale_nuovi_casi", null, AggregateEnum.Day),
      this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', null, AggregateEnum.Day),
      this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', null, AggregateEnum.Day),
      this.seriesService.generateRegionalSeries(region, 'nuovi_ricoverati_con_sintomi', null, AggregateEnum.Day),
      this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', null, AggregateEnum.Day),
    ])
      .subscribe(data => {
        this.seriesDailyColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesDailyData = data
      })

    forkJoin([
      this.seriesService.generateRegionalSeries(region, 'terapia_intensiva', null, AggregateEnum.Day, true),
    ])
      .subscribe(data => {
        this.seriesIntensiveCareColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesIntensiveCareData = data
      })

    forkJoin([
      this.seriesService.generateRegionalSeries(region, 'nuovi_tamponi', null, AggregateEnum.Day),
      this.seriesService.generateRegionalSeries(region, 'nuovi_casi_testati', null, AggregateEnum.Day)
    ])
      .subscribe(data => {
        this.seriesSwabColorScheme = {
          domain: data.map(series => this.legendsService.legendsDict[series.key].color)
        }
        this.seriesSwabData = data
      })

    this.seriesService.generateRegionalSeries(region, 'ricoverati_con_sintomi', null, AggregateEnum.Day, true)
      .subscribe(data => {
        this.seriesHospitalizedColorScheme = {
          domain: [this.legendsService.legendsDict[data.key].color]
        }
        this.seriesHospitalizedData = [data]
      })

    this.seriesService.generateRegionalSeries(region, 'totale_nuovi_casi', 'nuovi_casi_testati', this.aggregateCasesPerPeopleTestedRate, true)
      .subscribe(data => {
        this.seriesCasesPerPeopleTestedRateColorScheme = {
          domain: [this.legendsService.legendsDict.totale_nuovi_casi_nuovi_casi_testati.color]
        }
        this.seriesCasesPerPeopleTestedRateData = [data]
      })

    this.dataService.getProvincialDataObservable().subscribe(() => {
      this.getTotalCasesBarsData()
      this.getCasesPerPeopleTestedBarsData()
      this.getNewPositiveBarsData()
    })
  }

  private setProvincialData(region: string, province: string) {

    this.seriesService.generateProvincialSeries(region, province, 'totale_casi', null, AggregateEnum.Day, true)
      .subscribe(data => {
        this.seriesColorScheme = {
          domain: [this.legendsService.legendsDict[data.key].color]
        }
        this.seriesData = [data]
        this.numbersData = this.numbersService.generateProvinceNumbers(region, province)
        this.numbersServiceColorScheme = { domain: this.numbersData.map(bar => bar.color) }
      })

    this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', null, AggregateEnum.Day)
      .subscribe(data => {
        this.seriesDailyColorScheme = {
          domain: [this.legendsService.legendsDict[data.key].color]
        }
        this.seriesDailyData = [data]
      })
  }

  getTotalCasesBarsData($event = { value: null }) {
    [this.totalCasesBarsData, this.totalCasesBarsMax] = (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_casi', $event.value)
    )
  }

  getCasesPerPeopleTestedBarsData($event = { value: null }) {
    [this.casesPerPeopleTestedBarsData, this.casesPerPeopleTestedBarsMax] =       
    this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value, 'nuovi_casi_testati')
  }

  getNewPositiveBarsData($event = { value: null }) {
    [this.newPositiveBarsData, this.newPositiveBarsMax] = (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value)
    )
  }

  getIntensiveBarsData($event = { value: null }) {
    [this.intensiveBarsData, this.intensiveBarsMax] = this.barsService.generateRegionalBars('terapia_intensiva', $event.value)
  }

  getHospitalizedBarsData($event = { value: null }) {
    [this.hospitalizedBarsData, this.hospitalizedBarsMax] = this.barsService.generateRegionalBars('ricoverati_con_sintomi', $event.value)
  }

  getLethalityBarsData($event = { value: null }) {
    [this.lethalityBarsData, this.lethalityBarsMax] = this.barsService.generateRegionalBars('deceduti', $event.value, 'totale_casi')
  }

  getDailyDeathBarsData($event = { value: null }) {
    [this.dailyDeathBarsData, this.dailyDeathBarsMax] = this.barsService.generateRegionalBars('nuovi_deceduti', $event.value)
  }
  
  getDeathBarsData($event = { value: null }) {
    [this.deathBarsData, this.deathBarsMax] = this.barsService.generateRegionalBars('deceduti', $event.value)
  }


  getDailyCasesPerProvinceBarsData($event = { value: null }) {
    [this.dailyCasesPerProvinceBarsData, this.dailyCasesPerProvinceBarsMax] = this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value)
  }

  getTotalSwabBarsData($event = { value: null }) {
    [this.totalSwabBarsData, this.totalSwabBarsMax] = this.barsService.generateRegionalBars('tamponi', $event.value)
  }

  getNewSwabBarsData($event = { value: null }) {
    [this.newSwabBarsData, this.newSwabBarsMax] = this.barsService.generateRegionalBars('nuovi_tamponi', $event.value)
  }

  changeAggregateCasesPerPeopleTestedRate($event) {
    this.aggregateCasesPerPeopleTestedRate = $event
    this.initData()
  }

  changeScale($event) {
    this.log10 = ScaleEnum.Log10 == $event
    this.initData()
  }

  public formatPercentage(input) {
    return `${input ? formatNumber(input, document.documentElement.lang) : input} %`
  }

  public formatRound(input) {
    return input ? formatNumber(Math.round(input), document.documentElement.lang) : input
  }

  public formatPow10(input) {
    return input ? formatNumber(Math.round(Math.pow(10, input)), document.documentElement.lang) : input
  }

  public valueFormatting(input) {
    return typeof input.value === 'number' ?
      formatNumber(input.value, document.documentElement.lang) :
      input.value
  }

  public gridLineNgStyleByYAxisTick(tick) {
    return tick == 0 ? { stroke: '#999' } : null
  }
}