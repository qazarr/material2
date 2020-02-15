/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'drag-drop-demo',
  templateUrl: 'drag-drop-demo.html',
  styleUrls: ['drag-drop-demo.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropDemo {
  hierarchy = [
    { key: 'a', name: 'Parent_1', items: [{ name: 'child a' }, { name: 'child b' }] },
    { key: 'b', name: 'Parent_2', items: [{ name: 'child c' }, { name: 'child d' }] }
  ];

  allLists = ['list-root', 'list-a', 'list-b'];


  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
