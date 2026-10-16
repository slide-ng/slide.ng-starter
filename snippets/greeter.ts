// #region greeter
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-greeter',
  template: `<h1>Hello {{ name() }}</h1>`,
})
export class Greeter {
  name = signal('slide.ng');
}
// #endregion greeter

export const note = 'Everything outside the region is not shown in the slide.';
