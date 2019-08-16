import {Component} from '@angular/core';

/**
 * @title Basic use of the tab nav bar
 */
@Component({
  selector: 'mdc-tab-nav-bar-basic-example',
  templateUrl: 'mdc-tab-nav-bar-basic-example.html',
  styleUrls: ['mdc-tab-nav-bar-basic-example.css'],
})
export class MdcTabNavBarBasicExample {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background = '';

  toggleBackground() {
    this.background = this.background ? '' : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }
}
