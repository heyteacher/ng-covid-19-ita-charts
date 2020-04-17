import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgxChartsModule } from '@heyteacher/ngx-charts';
import { NgModule } from '@angular/core';
import { MatTreeModule } from "@angular/material/tree";
import { TreeMenuComponent } from './tree-menu/tree-menu.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule} from "@angular/material/button";
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
import { MatMenuModule} from '@angular/material/menu';
import { MatSelectModule} from '@angular/material/select';
import { MatButtonToggleModule} from "@angular/material/button-toggle";

import { AppRoutingModule } from './app-rounting.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BarsControlComponent } from './bars-control/bars-control.component';
import { SeriesControlComponent } from './series-control/series-control.component';
import { GoogleAnalyticsModule } from './google-analytics/google-analytics.module';

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    TreeMenuComponent,
    BarsControlComponent,
    SeriesControlComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NgxChartsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTreeModule,
    MatToolbarModule,
    MatMenuModule,
    AppRoutingModule,
    FontAwesomeModule,
    MatSelectModule,
    MatButtonToggleModule,
    GoogleAnalyticsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
