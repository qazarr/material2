/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ElementRef, QueryList} from '@angular/core';
import {
  MDCTabIndicatorFoundation,
  MDCSlidingTabIndicatorFoundation,
  MDCTabIndicatorAdapter
} from '@material/tab-indicator';

export interface MatInkBarItem {
  _foundation: MatInkBarFoundation;
  elementRef: ElementRef<HTMLElement>;
}

export class MatInkBar {
  private _currentItem: MatInkBarItem|undefined;

  constructor(private _items: QueryList<MatInkBarItem>) {}

  hide() {
    this._items.forEach(item => item._foundation.deactivate());
  }

  alignToElement(element: HTMLElement) {
    const correspondingItem = this._items.find(item => item.elementRef.nativeElement === element);
    const currentItem = this._currentItem;

    if (currentItem) {
      currentItem._foundation.deactivate();
    }

    if (correspondingItem) {
      const clientRect = currentItem ?
          currentItem._foundation.computeContentClientRect() : undefined;

      // The MDC indicator won't animate unless we give it the `ClientRect` of the previous item.
      correspondingItem._foundation.activate(clientRect);
      this._currentItem = correspondingItem;
    }
  }
}

export class MatInkBarFoundation {
  private _foundation: MDCTabIndicatorFoundation;
  private _element: HTMLElement;
  private _indicator: HTMLElement;
  private _indicatorContent: HTMLElement;
  private _adapter: MDCTabIndicatorAdapter = {
    addClass: className => this._element.classList.add(className),
    removeClass: className => this._element.classList.remove(className),
    setContentStyleProperty: (propName, value) => {
      this._indicatorContent.style.setProperty(propName, value);
    },
    computeContentClientRect: () => {
      return this._indicatorContent.getBoundingClientRect();
    }
  };

  constructor(elementRef: ElementRef<HTMLElement>, document: Document) {
    this._element = elementRef.nativeElement;
    this._foundation = new MDCSlidingTabIndicatorFoundation(this._adapter);
    this._createIndicator(document);
  }

  activate(clientRect?: ClientRect) {
    this._foundation.activate(clientRect);
  }

  deactivate() {
    this._foundation.deactivate();
  }

  computeContentClientRect() {
    return this._foundation.computeContentClientRect();
  }

  init() {
    this._foundation.init();
  }

  destroy() {
    const indicator = this._indicator;

    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }

    this._element = this._indicator = this._indicatorContent = null!;
    this._foundation.destroy();
  }

  private _createIndicator(document: Document) {
    if (!this._indicator) {
      const indicator = this._indicator = document.createElement('span');
      const content = this._indicatorContent = document.createElement('span');

      indicator.className = 'mdc-tab-indicator';
      content.className = 'mdc-tab-indicator__content mdc-tab-indicator__content--underline';

      indicator.appendChild(content);
      this._element.appendChild(indicator);
    }
  }
}
