/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, ElementRef, ViewEncapsulation} from '@angular/core';


/**
 * The entry app for demo site. Routes under `accessibility` will use AccessibilityDemo component,
 * while other demos will use `DemoApp` component. Since DemoApp and AccessibilityDemo use
 * different templates (DemoApp has toolbar and sidenav), we use this EntryApp in index.html
 * as our entry point.
 */
@Component({
  moduleId: module.id,
  selector: 'entry-app',
  template: '<router-outlet></router-outlet>',
})
export class EntryApp {}

/**
 * Home component for welcome message in DemoApp.
 */
@Component({
  selector: 'home',
  template: `
    <p>Welcome to the development demos for Angular Material!</p>
    <p>Open the sidenav to select a demo.</p>

    <button matTooltip="Oh no">Click</button>
  `,
})
export class Home {}

/**
 * DemoApp with toolbar and sidenav.
 */
@Component({
  moduleId: module.id,
  selector: 'demo-app',
  templateUrl: 'demo-app.html',
  styleUrls: ['demo-app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
  dark = false;
  navItems = [];

  constructor(
    private _element: ElementRef,
    private _overlayContainer: OverlayContainer) {}

  toggleFullscreen() {
    console.log('fullscreen!');
  }

  toggleTheme() {
    console.log('theme!');
  }
}
