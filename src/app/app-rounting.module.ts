import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';


const appRoutes: Routes = [
  { path: '',  component: ChartsComponent },
  { path: ':region', component: ChartsComponent },
  { path: ':region/:province', component: ChartsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
