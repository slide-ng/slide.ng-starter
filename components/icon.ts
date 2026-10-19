import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

// An ng-icons icon as a tag: <starter-icon name="lucideRocket" size="48" />.
// Every icon you use must be listed in setup/main.ts.
@Component({
  selector: 'starter-icon',
  imports: [NgIcon],
  template: `<ng-icon [name]="name()" [size]="size()" [color]="color()" [strokeWidth]="strokeWidth()" />`,
})
export class StarterIcon {
  name = input.required<string>();
  size = input('1.5rem');
  color = input('currentColor');
  strokeWidth = input('2');
}
