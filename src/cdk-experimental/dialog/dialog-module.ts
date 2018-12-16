/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {A11yModule} from '@angular/cdk/a11y';
import {Dialog} from './dialog';
import {CdkDialogContainer} from './dialog-container';
import {MAT_DIALOG_SCROLL_STRATEGY_PROVIDER} from './dialog-injectors';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    A11yModule,
  ],
  exports: [
    CdkDialogContainer,
  ],
  declarations: [
    CdkDialogContainer,
  ],
  providers: [
    Dialog,
    MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
  ],
  entryComponents: [CdkDialogContainer],
})
export class DialogModule {}
