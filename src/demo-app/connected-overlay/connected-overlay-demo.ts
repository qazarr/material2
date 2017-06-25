import {
    Component,
    ViewChildren,
    QueryList,
    ViewEncapsulation,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {
  Overlay,
  OverlayState,
  OverlayOrigin,
  ComponentPortal,
  Portal,
  TemplatePortalDirective, OverlayRef, ConnectionPositionPair, HorizontalConnectionPos,
  VerticalConnectionPos,
} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'overlay-demo',
  templateUrl: 'connected-overlay-demo.html',
  styleUrls: ['connected-overlay-demo.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ConnectedOverlayDemo {
  @ViewChild(OverlayOrigin) _overlayOrigin: OverlayOrigin;

  originX: HorizontalConnectionPos = 'start';
  originY: VerticalConnectionPos = 'bottom';
  overlayX: HorizontalConnectionPos = 'start';
  overlayY: VerticalConnectionPos = 'top';

  overlayRef: OverlayRef | null;

  constructor(public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  openWithConfig() {
    let strategy = this.overlay.position()
        .betterConnectedTo(
            this._overlayOrigin.elementRef,
            {originX: this.originX, originY: this.originY},
            {overlayX: this.overlayX, overlayY: this.overlayY} );

    let config = new OverlayState();
    config.positionStrategy = strategy;

    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(new ComponentPortal(DemoOverlay, this.viewContainerRef));
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}


@Component({
  selector: 'demo-overlay',
  template: '<ul><li *ngFor="let item of items; index as i">item {{i}}</li></ul>',
  encapsulation: ViewEncapsulation.None,
})
export class DemoOverlay {
  items = Array(100);
}

