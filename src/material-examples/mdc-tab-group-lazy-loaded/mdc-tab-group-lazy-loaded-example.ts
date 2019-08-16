import {Component} from '@angular/core';

/**
 * @title Tab group where the tab content is loaded lazily (when activated)
 */
@Component({
  selector: 'mdc-tab-group-lazy-loaded-example',
  templateUrl: 'mdc-tab-group-lazy-loaded-example.html',
  styleUrls: ['mdc-tab-group-lazy-loaded-example.css'],
})
export class MdcTabGroupLazyLoadedExample {
  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }
}
