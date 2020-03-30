import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { MatTreeModule } from "@angular/material/tree";
import { TreeMenuComponent } from './tree-menu/tree-menu.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
import { MatMenuModule} from '@angular/material/menu';
import { MatSelectModule} from '@angular/material/select';
import { MatButtonToggleModule} from "@angular/material/button-toggle";

import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-rounting.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BarsControlComponent } from './bars-control/bars-control.component';


@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    TreeMenuComponent,
    BarsControlComponent,
  ],
  imports: [
    BrowserModule,
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
    MatButtonToggleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
