import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Counter } from './components/counter/counter';
import { UserList } from './components/user-list/user-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Counter, UserList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend-app');
}
