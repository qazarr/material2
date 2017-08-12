/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  ElementRef,
  NgZone,
  Renderer2,
  Directive,
  ViewChild,
  HostBinding,
} from '@angular/core';
import {CanColor, mixinColor} from '../core/common-behaviors/color';


// TODO(josephperrott): Benchpress tests.

/** A single degree in radians. */
const DEGREE_IN_RADIANS = Math.PI / 180;
/** Duration of the indeterminate animation. */
const DURATION_INDETERMINATE = 667;
/** Duration of the indeterminate animation. */
const DURATION_DETERMINATE = 225;
/** Start animation value of the indeterminate animation */
const startIndeterminate = 3;
/** End animation value of the indeterminate animation */
const endIndeterminate = 80;
/** Maximum angle for the arc. The angle can't be exactly 360, because the arc becomes hidden. */
const MAX_ANGLE = 359.99 / 100;
/** Whether the user's browser supports requestAnimationFrame. */
const HAS_RAF = typeof requestAnimationFrame !== 'undefined';
/** Default stroke width as a percentage of the viewBox. */
export const PROGRESS_SPINNER_STROKE_WIDTH = 10;

export type ProgressSpinnerMode = 'determinate' | 'indeterminate';

type EasingFn = (currentTime: number, startValue: number,
                 changeInValue: number, duration: number) => number;


/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-progress-spinner, mat-progress-spinner',
  host: {'class': 'mat-progress-spinner'}
})
export class MdProgressSpinnerCssMatStyler {}

// Boilerplate for applying mixins to MdProgressSpinner.
/** @docs-private */
export class MdProgressSpinnerBase {
  constructor(public _renderer: Renderer2, public _elementRef: ElementRef) {}
}
export const _MdProgressSpinnerMixinBase = mixinColor(MdProgressSpinnerBase, 'primary');

/**
 * <md-progress-spinner> component.
 */
@Component({
  moduleId: module.id,
  selector: 'md-progress-spinner, mat-progress-spinner',
  host: {
    'role': 'progressbar',
    '[attr.aria-valuemin]': '_ariaValueMin',
    '[attr.aria-valuemax]': '_ariaValueMax',
    '[attr.aria-valuenow]': 'value',
    '[attr.mode]': 'mode',
  },
  inputs: ['color'],
  templateUrl: 'progress-spinner.html',
  styleUrls: ['progress-spinner.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdProgressSpinner {

  /**
   * Value of the progress circle.
   *
   * Input:number, defaults to 0.
   * _value is bound to the host as the attribute aria-valuenow.
   */
  @HostBinding('attr.aria-valuenow')
  @Input('value')
  _value: number = 0;

  /**
   * Mode of the progress circle
   *
   * Input must be one of the values from ProgressMode, defaults to 'determinate'.
   * mode is bound to the host as the attribute host.
   */
  @HostBinding('attr.mode')
  @Input() mode: 'determinate' | 'indeterminate' = 'determinate';

  @Input() strokeWidth: any;


  /**
   * Gets the current stroke dash offset to represent the progress circle.
   *
   * The stroke dash offset specifies the distance between dashes in the circle's stroke.
   * Setting the offset to a percentage of the total circumference of the circle, fills this
   * percentage of the overall circumference of the circle.
   */
  strokeDashOffset() {
    // To determine how far the offset should be, we multiple the current percentage by the
    // total circumference.

    // The total circumference is calculated based on the radius we use, 45.
    // PI * 2 * 45
    return 251.3274 * (100 - this._value) / 100;
  }


  /** Gets the progress value, returning the clamped value. */
  get value() {
    return this._value;
  }


  /** Sets the progress value, clamping before setting the internal value. */
  set value(v: number) {
    if (v != null) {
      this._value = MdProgressSpinner.clamp(v);
    }
  }


  /** Clamps a value to be between 0 and 100. */
  static clamp(v: number) {
    return Math.max(0, Math.min(100, v));
  }
}


/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
@Component({
  moduleId: module.id,
  selector: 'md-spinner, mat-spinner',
  host: {
    'role': 'progressbar',
    'mode': 'indeterminate',
    'class': 'mat-spinner',
  },
  inputs: ['color'],
  templateUrl: 'progress-spinner.html',
  styleUrls: ['progress-spinner.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSpinner extends MdProgressSpinner {
  constructor() {
    super();
    this.mode = 'indeterminate';
  }
}


/**
 * Module functions.
 */

/** Clamps a value to be between 0 and 100. */
function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}


/**
 * Converts Polar coordinates to Cartesian.
 */
function polarToCartesian(radius: number, pathRadius: number, angleInDegrees: number) {
  let angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;

  return (radius + (pathRadius * Math.cos(angleInRadians))) +
    ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}


/**
 * Easing function for linear animation.
 */
function linearEase(currentTime: number, startValue: number,
                    changeInValue: number, duration: number) {
  return changeInValue * currentTime / duration + startValue;
}


/**
 * Easing function to match material design indeterminate animation.
 */
function materialEase(currentTime: number, startValue: number,
                      changeInValue: number, duration: number) {
  let time = currentTime / duration;
  let timeCubed = Math.pow(time, 3);
  let timeQuad = Math.pow(time, 4);
  let timeQuint = Math.pow(time, 5);
  return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}


/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param rotation The starting point of the circle with 0 being the 0 degree point.
 * @param strokeWidth Stroke width of the progress spinner arc.
 * @return A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue: number, rotation: number, strokeWidth: number): string {
  let startPoint = rotation || 0;
  let radius = 50;
  let pathRadius = radius - strokeWidth;

  let startAngle = startPoint * MAX_ANGLE;
  let endAngle = currentValue * MAX_ANGLE;
  let start = polarToCartesian(radius, pathRadius, startAngle);
  let end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
  let arcSweep = endAngle < 0 ? 0 : 1;
  let largeArcFlag: number;

  if (endAngle < 0) {
    largeArcFlag = endAngle >= -180 ? 0 : 1;
  } else {
    largeArcFlag = endAngle <= 180 ? 0 : 1;
  }

  return `M${start}A${pathRadius},${pathRadius} 0 ${largeArcFlag},${arcSweep} ${end}`;
}
