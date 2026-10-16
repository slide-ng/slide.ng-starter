import { Component, input, signal } from '@angular/core';

// A small Angular component. Slides can use it as <starter-counter [start]="10" />.
// Every exported component with a selector in components/ is found automatically.
@Component({
  selector: 'starter-counter',
  template: `
    <div class="inline-flex items-center border border-gray-400 rounded-md">
      <button class="px-3 py-2 font-mono hover:bg-gray-400/20" (click)="n.update((v) => v - 1)">-</button>
      <span class="px-4 min-w-12 text-center">{{ n() }}</span>
      <button class="px-3 py-2 font-mono hover:bg-gray-400/20" (click)="n.update((v) => v + 1)">+</button>
    </div>
  `,
})
export class StarterCounter {
  start = input(0);
  n = signal(0);

  ngOnInit() {
    this.n.set(this.start());
  }
}
