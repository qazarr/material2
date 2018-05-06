/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Routes} from '@angular/router';
import {DemoApp, Home} from './demo-app';

export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: DemoApp, children: [
    {path: '', component: Home},
    {
      path: 'lazy',
      loadChildren: 'ffs/demo-ffs#LazyLoadingModule'
    }
  ]}
];

export const ALL_ROUTES: Routes = [
  {path: '',  component: DemoApp, children: DEMO_APP_ROUTES},
];
