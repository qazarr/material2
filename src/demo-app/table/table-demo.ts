/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}


@Component({
  moduleId: module.id,
  templateUrl: 'table-demo.html',
})
export class TableDemo {
  desserts: Dessert[] = [
    {name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4},
    {name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4},
    {name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6},
    {name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4},
    {name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4},
  ];

  sortedData: Dessert[];

  sortActive: string;
  sortDirection: string;

  constructor() {
    this.sortedData = this.desserts.slice();

    this.sortActive = 'fat';
    this.sortDirection = 'asc';
  }

  sort(columnName: string) {
    // Don't care about the sorting, just want to test the Header's Sort-Arrow

    this.sortActive = columnName;
    this.sortDirection = (this.sortDirection === 'asc') ? 'desc' : 'asc';
    // console.log(this.sortActive, this.sortDirection);
  }
}
