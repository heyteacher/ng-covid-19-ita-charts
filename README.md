# Covid-19 Italy Angular Dashboard

[![Liberpay](http://img.shields.io/liberapay/receives/heyteacher.svg?logo=liberapay)](https://liberapay.com/heyteacher/donate)
[![GitHub license](https://img.shields.io/github/license/heyteacher/ng-covid-19-ita-charts)](https://github.com/heyteacher/ng-covid-19-ita-charts/blob/master/LICENSE)
[![GitHub commit](https://img.shields.io/github/last-commit/heyteacher/ng-covid-19-ita-charts)](https://github.com/heyteacher/ng-covid-19-ita-charts/commits/master)

__Angular 9__  project of https://heyteacher.github.io/COVID-19/ a COVID-19 Italy Charts based on dataset https://github.com/heyteacher/COVID-19. 

Developed with: 

* `Angular 9` 
* `ngx-charts`: https://github.com/swimlane/ngx-charts
* `Angular Material`
* `Bootstrap 4`
* `Font Awasome`

Datasources JSON are downloaded directly in raw mode from https://github.com/heyteacher/COVID-19, no backend is needed.

## Quickstart

1. install `Angular CLI`: https://angular.io/guide/setup-local
1. `npm install`
1. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Source Code Structure

Main components and services

```
src/
│
└───app/
    └─── bars-control/ component on header of bar charts 
    │                  with play, pause, stop and select 
    │                  a day in the past  
    │ 
    └─── charts/ main component with bars and series charts
    │ 
    └─── legend/ generic legend component for series chart 
    │ 
    └─── google-analytics/ module for track pages and event 
    │                      in Google Analytics  
    │ 
    └─── series-control/ component on header of series charts 
    │                  with Log/Linear view  
    │ 
    └─── tree-menu/ component tree in the left side with
    │               levels contry -> region -> province
    │ 
    └─── app-routing.module.ts the routing module to access 
    │                          directly to region /<Region> 
    │                          and province 
    │                          /<Region>/<Province> via URL
    │ 
    └─── app.model.ts model of dataset for Bar, Series and 
    |                 tree Node, and utility function
    |
    └─── bars.service.ts prepare data to bar charts
    |
    └─── data.service.ts download JSON and prepare datasets 
    |                    and `tree-menu` structure 
    |
    └─── legends.service.ts manage legends and checkbox 
    |                       show/hide series in charts    
    |
    └─── numbers.service.ts prepare data per numbers 
    |                       charts    
    |
    └─── series.service.ts prepare data to series and bar 
    |                      charts    
    |
└───locale/
    └─── messages.it.xlf italian translations 
    |
    └─── messages.xlf default translation (en)
```

## ngx-charts fork

This project use `@heyteacher/ngx-charts` my fork of official repository `@swimlane/ngx-charts` which introduce these changes:

* branch [format-tooltip-line-area-charts](https://github.com/heyteacher/ngx-charts/tree/format-tooltip-line-area-charts): apply `yAxisTickFormatting` to toolptip value in line and area charts

* branch [adding-axisTickClassByTick-line-area-charts](https://github.com/heyteacher/ngx-charts/tree/adding-axisTickClassByTick-line-area-charts): introduce `xAxisTickClassByTick` and `xAxisTickClassByTick` in order to customize grid line depenting tick value (e.g. weekend x-axis, zero y-axis)

These branches are constantly updated with official repository `@swimlane/ngx-chart` and merged into a release branch [heyteacher-release](https://github.com/heyteacher/ngx-charts/tree/heyteacher-release) which is published in `npmjs.com`: https://www.npmjs.com/package/@heyteacher/ngx-charts 

## Localizzation

Localization  is implemented via `ng xi18n`, `xliffmerge` (https://github.com/martinroob/ngx-i18nsupport) and `virtaal` (https://github.com/translate/virtaal)

Default language is `English` and is supported only `Italian` language

### Installation

1. install `xliffmerge` and `virtaal`

   ```
   sudo npm install -g ngx-i18nsupport
   sudo apt install virtaal
   ```

1. load `$localize` onto the global scope in `polifills.ts` adding:
   ```
   import '@angular/localize/init';
   ```

### Usage

1. use `i18n`, `i18n-title` HTML attributes and `$localize` as described in https://angular.io/guide/i18n

1. merge new strings to be traslated in `src/locale/messages.it.xlf`
   ```
   npm run i18n
   ```
   alias of:
   ```
   ng xi18n --output-path src/locale && xliffmerge --profile xliffmerge.json en it
   ```

1. run `virtaal` and fix missin translations in `src/locale/messages.it.xlf`

1. test missing traslation `$localize` in `*.ts` (not discovered by `ng xi18n`) 
   ```
   npm run serve-prod-it
   ```

1. insert missing `$localize` translations in: 
   ```
   locale/messages.it.xlf
   ```
   and translate them

## Release

Dashboard can be released in github.io pages (i.e. https://\<gitub-user\>.github.io/COVID-19) 

### Release in github.io 

#### Initial Configuration 

Replace <gitub-user> with your account

1. create repository for pages `https://<gitub-user>.github.io/<base_href>` in github

1. checkout the repository inside dist
   ``` 
   cd dist
   git checkout  https://<gitub-user>.github.io/COVID-19 prod
   cd ..
   ```

1. copy `src/index.prod.html.sample` in `src/index.prod.html` end edit `<baseHref>`, header metadata property, GA id ...etc

1. copy `src/environments/environment.prod.ts.sample` in `src/environments/environment.prod.ts` end edit `baseHref`, shared properties 

1. run locally prod environment
   ```
   npm run serve-prod
   ```
   or italian localization
   ```
   npm run serve-prod-it
   ```

1. test locally prod environment at http://localhost:4200/COVID-19

1. run locally prod italian environment 
   ```
   npm run serve-prod-it
   ```

1. test locally prod environment at http://localhost:4200/COVID-19/it

   
#### Release Command

1. run script
   ```
   ng run release
   ```

1. browser `https://<gitub-user>.github.io/COVID-19`
