/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DemoApp, Home} from './demo-app';
import {DEMO_APP_ROUTES} from './routes';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [
    RouterModule.forChild(DEMO_APP_ROUTES),
  ],
  declarations: [
    DemoApp,
    Home,
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoModule {
}
