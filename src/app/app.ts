import { Component, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { BottomNav } from './shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BottomNav
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly router = inject(Router);

  readonly showBottomNav = signal(
    !this.router.url.startsWith('/login')
  );

  constructor() {

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        this.showBottomNav.set(
          !event.urlAfterRedirects.startsWith('/login')
        );

      });
  }
}