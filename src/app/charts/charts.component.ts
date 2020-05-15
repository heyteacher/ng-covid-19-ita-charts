import { Component } from '@angular/core';
import { SeriesService } from '../series.service';
import { ActivatedRoute } from '@angular/router';
import { Bar, Series, Legend, objectify } from '../app.model';
import { BarsService } from '../bars.service';
import { NumbersService } from '../numbers.service';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { formatNumber } from '@angular/common';
import { LegendEntryComponent } from '@heyteacher/ngx-charts';
import { LegendsService } from '../legends.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent {
  breadcrumbs: any;

  seriesData: Series[] = [];
  seriesDailyData: Series[] = [];
  seriesPercData: Series[] = [];
  seriesSwabData: Series[];

  totalCasesBarsData: Bar[] = [];
  totalCasesBarsMax: number;

  intensiveBarsData: Bar[] = [];
  intensiveBarsMax: number;

  newPositiveBarsData: Bar[];
  newPositiveBarsMax: number;

  totalCasesPerProvinceBarsData: Bar[] = [];
  totalCasesPerProvinceBarsMax: number;

  totalSwabBarsData: Bar[] = []
  totalSwabBarsMax: number;

  positivePerSwabBarsData: Bar[] = []
  positivePerSwabBarsMax: number;

  dailyPositivePerSwabBarsData: Bar[] = []
  dailyPositivePerSwabBarsMax: number;

  lethalityBarsData: Bar[] = []
  lethalityBarsMax: number;

  dailyDeathBarsData: Bar[] = []
  dailyDeathBarsMax: number;

  deathBarsData: Bar[] = []
  deathBarsMax: number;

  newCasesPercBarsData: Bar[] = []
  newCasesPercBarsMax: number;

  newSwabBarsData: Bar[] = [];
  newSwabBarsMax: number;

  numbersData: Bar[] = [];

  showLegend: boolean
  log10: boolean = true
  legendsService: LegendsService

  constructor(
    private seriesService: SeriesService,
    private barsService: BarsService,
    private numbersService: NumbersService,
    legendsService: LegendsService,
    activateRoute: ActivatedRoute
  ) {
    this.legendsService = legendsService
    activateRoute.params.subscribe(params => {
      this.breadcrumbs = params
      this.initData()
    })
  }

  changeLegend(event) {
    this.legendsService.legendsDict[event.name].checked = event.checked
    this.initData()
  }
  changeProvLegend(event) {
    this.legendsService.provLegendsDict[event.name].checked = event.checked
    this.initData()
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
    forkJoin(
      this.seriesService.generateCountrySeries('totale_casi', this.legendsService.legendsDict.confirmed, null, log10fn),
      this.seriesService.generateCountrySeries("dimessi_guariti", this.legendsService.legendsDict.recovered, null, log10fn),
      this.seriesService.generateCountrySeries('terapia_intensiva', this.legendsService.legendsDict.intensiveCare, null, log10fn),
      this.seriesService.generateCountrySeries('deceduti', this.legendsService.legendsDict.deaths, null, log10fn),
      this.seriesService.generateCountrySeries('totale_positivi', this.legendsService.legendsDict.currentPositive, null, log10fn),
    )
      .subscribe(data => this.seriesData = data)

    forkJoin(
      this.seriesService.generateCountrySeries("totale_nuovi_casi", this.legendsService.legendsDict.confirmed),
      this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', this.legendsService.legendsDict.recovered),
      this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', this.legendsService.legendsDict.intensiveCare),
      this.seriesService.generateCountrySeries('nuovi_deceduti', this.legendsService.legendsDict.deaths),
      this.seriesService.generateCountrySeries('variazione_totale_positivi', this.legendsService.legendsDict.currentPositive),
      this.seriesService.generateCountryARIMAForecastSeries('p50', this.legendsService.legendsDict.awsForecastARIMA),
      this.seriesService.generateCountryForecastDeepARPlusSeries('p50', this.legendsService.legendsDict.awsForecastDeepARPlus)
    )
      .subscribe(data => this.seriesDailyData = data)

    forkJoin(
      this.seriesService.generateCountrySeries('totale_nuovi_casi', this.legendsService.legendsDict.confirmed, 'totale_casi_ieri'),
      this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', this.legendsService.legendsDict.recovered, 'dimessi_guariti_ieri'),
      this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', this.legendsService.legendsDict.intensiveCare, 'terapia_intensiva_ieri'),
      this.seriesService.generateCountrySeries('nuovi_deceduti', this.legendsService.legendsDict.deaths, 'deceduti_ieri'),
      this.seriesService.generateCountrySeries('variazione_totale_positivi', this.legendsService.legendsDict.currentPositive, 'totale_positivi'),
    )
      .subscribe(data => this.seriesPercData = data)

    forkJoin(
      this.seriesService.generateCountrySeries('nuovi_tamponi', this.legendsService.legendsDict.tests),
      this.seriesService.generateCountrySeries('nuovi_casi_testati', this.legendsService.legendsDict.peopleTested)
    )
      .subscribe(data => this.seriesSwabData = data)

    this.getIntensiveBarsData()
    this.getNewPositiveBarsData()

    this.getLethalityBarsData()
    this.getDailyDeathBarsData()
    this.getDeathBarsData()

    this.getDailyPositivePerSwabBarsData()

    this.getNewCasesPercBarsData()
    this.getTotalCasesBarsData()
    this.getTotalCasesPerProvinceBarsData()

    this.getTotalSwabBarsData()
    this.getPositivePerSwabBarsData()
    this.getNewSwabBarsData()

    this.numbersService.generateCountryNumbers()
      .subscribe(data => this.numbersData = data)
  }

  private setRegionalData(region: string) {
    const log10fn = this.log10 ? ((n) => n && n > 0 ? Math.log10(n) : n) : null
    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'totale_casi', this.legendsService.legendsDict.confirmed, null, log10fn),
      this.seriesService.generateRegionalSeries(region, "dimessi_guariti", this.legendsService.legendsDict.recovered, null, log10fn),
      this.seriesService.generateRegionalSeries(region, 'terapia_intensiva', this.legendsService.legendsDict.intensiveCare, null, log10fn),
      this.seriesService.generateRegionalSeries(region, 'deceduti', this.legendsService.legendsDict.deaths, null, log10fn),
      this.seriesService.generateRegionalSeries(region, 'totale_positivi', this.legendsService.legendsDict.currentPositive, null, log10fn),
    )
      .subscribe(data => this.seriesData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, "totale_nuovi_casi", this.legendsService.legendsDict.confirmed),
      this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', this.legendsService.legendsDict.recovered),
      this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', this.legendsService.legendsDict.intensiveCare),
      this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', this.legendsService.legendsDict.deaths),
      this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', this.legendsService.legendsDict.currentPositive),
      this.seriesService.generateRegionalARIMAForecastSeries(region, 'p50', this.legendsService.legendsDict.awsForecastARIMA),
      this.seriesService.generateRegionalForecastDeepARPlusSeries(region, 'p50', this.legendsService.legendsDict.awsForecastDeepARPlus),
    )
      .subscribe(data => this.seriesDailyData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'totale_nuovi_casi', this.legendsService.legendsDict.confirmed, 'totale_casi_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', this.legendsService.legendsDict.recovered, 'dimessi_guariti_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', this.legendsService.legendsDict.intensiveCare, 'terapia_intensiva_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', this.legendsService.legendsDict.deaths, 'deceduti_ieri'),
      this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', this.legendsService.legendsDict.currentPositive, 'totale_positivi'),
    )
      .subscribe(data => this.seriesPercData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'nuovi_tamponi', this.legendsService.legendsDict.tests),
      this.seriesService.generateRegionalSeries(region, 'nuovi_casi_testati', this.legendsService.legendsDict.peopleTested)
    )
      .subscribe(data => this.seriesSwabData = data)


    this.getTotalCasesBarsData()
    this.getNewCasesPercBarsData()
    this.getNewPositiveBarsData()

    this.numbersService.generateRegionNumbers(region)
      .subscribe((data) => this.numbersData = data)
  }

  private setProvincialData(region: string, province: string) {

    forkJoin(
      this.seriesService.generateProvincialSeries(region, province, 'totale_casi', this.legendsService.provLegendsDict.confirmed),
      this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', this.legendsService.provLegendsDict.newConfirmed)
    )
      .subscribe(data => this.seriesData = data)

    this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', this.legendsService.provLegendsDict.newConfirmedRate, 'totale_casi_ieri')
      .subscribe(data => this.seriesPercData = [data])

    this.numbersService.generateProvinceNumbers(region, province)
      .subscribe(data => this.numbersData = data)
  }

  getTotalCasesBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_casi', $event.value)
    )
      .subscribe((data) => [this.totalCasesBarsData, this.totalCasesBarsMax] = data)
  }

  getNewCasesPercBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"], 'totale_casi_ieri') :
      this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value, 'totale_casi_ieri')
    )
      .subscribe((data) => [this.newCasesPercBarsData, this.newCasesPercBarsMax] = data)
  }

  getNewPositiveBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value)
    )
      .subscribe((data) => [this.newPositiveBarsData, this.newPositiveBarsMax] = data)
  }

  getIntensiveBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('terapia_intensiva', $event.value)
      .subscribe((data) => {
        [this.intensiveBarsData, this.intensiveBarsMax] = data
      })
  }

  getLethalityBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('deceduti', $event.value, 'totale_casi')
      .subscribe((data) => {
        [this.lethalityBarsData, this.lethalityBarsMax] = data
      })
  }

  getDailyDeathBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('nuovi_deceduti', $event.value)
      .subscribe((data) => {
        [this.dailyDeathBarsData, this.dailyDeathBarsMax] = data
      })
  }

  getDeathBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('deceduti', $event.value)
      .subscribe((data) => {
        [this.deathBarsData, this.deathBarsMax] = data
      })
  }


  getTotalCasesPerProvinceBarsData($event = { value: null }) {
    this.barsService.generateProvincialBars('totale_casi', $event.value)
      .subscribe((data) => {
        [this.totalCasesPerProvinceBarsData, this.totalCasesPerProvinceBarsMax] = data
      })
  }

  getTotalSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('tamponi', $event.value)
      .subscribe((data) => {
        [this.totalSwabBarsData, this.totalSwabBarsMax] = data
      })
  }

  getNewSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('nuovi_tamponi', $event.value)
      .subscribe((data) => {
        [this.newSwabBarsData, this.newSwabBarsMax] = data
      })
  }

  getPositivePerSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('totale_casi', $event.value, 'tamponi')
      .subscribe((data) => {
        [this.positivePerSwabBarsData, this.positivePerSwabBarsMax] = data
      })
  }
  getDailyPositivePerSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value, 'nuovi_tamponi')
      .subscribe((data) => {
        [this.dailyPositivePerSwabBarsData, this.dailyPositivePerSwabBarsMax] = data
      })
  }

  changeAggregate($event) {

  }

  changeLog10($event) {
    this.log10 = $event
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
  public gridLineNgStyleByXAxisTick(tick) {
    var day = moment(tick, 'DD/MM').day();
    var isWeekend = (day === 6) || (day === 0);
    return isWeekend ? { stroke: '#999' } : null
  }

  public gridLineNgStyleByYAxisTick(tick) {
    return tick == 0 ? { stroke: '#999' } : null
  }
}