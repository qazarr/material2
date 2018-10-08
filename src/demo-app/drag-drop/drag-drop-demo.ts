/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {CdkDrop} from '@angular/cdk/drag-drop';

@Component({
  templateUrl: 'drag-drop-demo.html',
  styles: [`
  .cdk-drop {
    display: block;
    min-height: 86px;
    outline: solid 2px;
    margin-bottom: 1em;
  }

  h3 {
    color: white;
  }

  .box {
    border: 1px solid black;
    margin-bottom: 1em;
    padding: 0.5em 1em;
  }

  .placeholder {
    background: #ccc;
    width: 100%;
    height: 20px;
    border: 1px dashed grey;
  }
  `]
})
export class DragAndDropDemo implements AfterViewInit {
  @ViewChildren(CdkDrop) cdkDrops: QueryList<CdkDrop>;

  layout: ILayout = {
    rows: [
      {
        cols: [
          {
            className: 'col-12',
            boxes: [
              { title: 'Box 1', p: [] },
              { title: 'Box 2', p: [] }

            ]
          }
        ]
      },
      {
        cols: [
          {
            className: 'col-8',
            boxes: [
            ]
          },
          {
            className: 'col-4',
            boxes: [
              { title: 'Box 3', p: ['This one is bigger'] },
            ]
          },
        ]
      }
    ]
  };

  ngAfterViewInit() {
    this.cdkDrops.forEach(item => {
      item.connectedTo = this.cdkDrops.filter(x => x.id !== item.id);
    });
  }
}

export interface ILayout {
  rows: IRow[];
}

export interface IRow {
  cols: IColumn[];
}

export interface IColumn {
  className: string;
  boxes: IBox[];
}

export interface IBox {
  p: string[];
  title: string;
}
