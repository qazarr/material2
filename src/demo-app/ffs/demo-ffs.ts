/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatTooltipModule} from '@angular/material';

export const LOL = 1;

@Component({
  selector: 'hello',
  template: `<h1 matTooltip="oh no">Hello World!</h1>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class TestComponent  {

}


const routes: Routes = [
  { path: '', component: TestComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatTooltipModule,
  ],
  declarations: [TestComponent]
})
export class LazyLoadingModule { }
