/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';
import {Overlay, ScrollStrategy} from '@angular/cdk/overlay';

/** Injection token for the Dialog's ScrollStrategy. */
export const DIALOG_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('DialogScrollStrategy');

/** Injection token for the Dialog's Data. */
export const DIALOG_DATA = new InjectionToken<any>('DialogData');

/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
    () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
