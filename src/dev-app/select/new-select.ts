/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import {ActiveDescendantKeyManager, Highlightable} from '@angular/cdk/a11y';
import {ENTER, SPACE, ESCAPE} from '@angular/cdk/keycodes';

let id = 0;

@Component({
  selector: 'new-option',
  host: {
    'role': 'option',
    '[attr.id]': 'id',
    '[attr.aria-selected]': '_isSelected() || null',
    '[class.is-active]': 'isActive',
    '(click)': '_handleClick()',
  },
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host(.is-active) {
      outline: solid 1px red;
    }

    :host([aria-selected="true"]) {
      color: red;
    }
  `]
})
export class NewOption implements Highlightable {
  id = `new-select-option-${id++}`;
  isActive = false;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _select: NewSelect) {}

  setActiveStyles(): void {
    this.isActive = true;
  }

  setInactiveStyles(): void {
    this.isActive = false;
  }

  _getContent() {
    return this._elementRef.nativeElement.textContent?.trim() || '';
  }

  _handleClick() {
    this._select._selectOption(this);
  }

  _isSelected() {
    return this._select.selectedOption === this;
  }
}

@Component({
  selector: 'new-select',
  template: `
    <div [attr.id]="labelId">{{label}}</div>
    <button
      #button
      aria-haspopup="listbox"
      [attr.aria-labelledby]="labelId + ' ' + selectedValueId"
      [attr.aria-expanded]="expanded"
      (click)="_triggerClicked()">
      <div [attr.id]="selectedValueId">{{_getSelectedLabel()}}</div>
    </button>
    <div
      *ngIf="expanded || alwaysInDom"
      #listbox
      class="listbox"
      role="listbox"
      tabindex="-1"
      [attr.aria-activedescendant]="_getActiveOption()?.id || null"
      (keydown)="_handleKeydown($event)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .listbox {
      outline: 0;
      max-width: 200px;
      display: none;
    }
  `]
})
export class NewSelect implements AfterContentInit {
  @ContentChildren(NewOption) options: QueryList<NewOption>;
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
  @ViewChild('listbox') listbox: ElementRef<HTMLElement>;
  @Input() label: string;
  @Input() alwaysInDom = true;
  labelId = `new-select-label-${id++}`;
  selectedValueId = `new-select-selected-value-${id++}`;
  selectedOption: NewOption | null = null;
  expanded = false;
  private _keyManager: ActiveDescendantKeyManager<NewOption>;

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager(this.options);
    this._keyManager.setFirstItemActive();
  }

  _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      event.preventDefault();
      this._setExpanded(false);
    } else if (event.keyCode === ENTER || event.keyCode === SPACE) {
      const activeOption = this._getActiveOption();

      if (activeOption) {
        event.preventDefault();
        this._selectOption(activeOption);
      }
    } else {
      this._keyManager.onKeydown(event);
    }
  }

  _getActiveOption(): NewOption | null {
    return this._keyManager?.activeItem;
  }

  _getSelectedLabel() {
    return this.selectedOption ? this.selectedOption._getContent() : 'No value';
  }

  _selectOption(option: NewOption) {
    this._keyManager.setActiveItem(option);
    this.selectedOption = option;
    this._setExpanded(false);
  }

  _triggerClicked() {
    this._setExpanded(!this.expanded);
  }

  private _setExpanded(isExpanded: boolean) {
    this.expanded = isExpanded;

    // Here for the `ngIf` case to wait for change detection.
    setTimeout(() => {
      if (this.listbox) {
        this.listbox.nativeElement.style.display = isExpanded ? 'block' : 'none';
      }

      (isExpanded ? this.listbox : this.button).nativeElement.focus();
    });
  }
}
