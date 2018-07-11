import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes }  from '@angular/router';

import { MainComponent }   from '../main/main/main.component';

const routes: Routes =  [
  {path: '',component: MainComponent, outlet: 'main'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { enableTracing: false })
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
