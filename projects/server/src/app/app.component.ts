import { animate, animation, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'projects/server/src/app/app.component.html',
  styleUrls: ['projects/server/src/app/app.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.5,
        backgroundColor: 'purple'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
    trigger('showHide', [
      transition(':enter', [
        animate('1s', style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow'
        }))
      ]),
      transition(':leave', [
        animate('0.5s', style({
          height: '100px',
          opacity: 0.5,
          backgroundColor: 'purple'
        }))
      ]),
    ]),
  ]
})
export class AppComponent {
  title = 'server';
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
