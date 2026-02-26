import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Todo } from './todo';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  templateUrl: './todo-card.components.html',
  styleUrls: ['./todo-card.components.scss'],
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class TodoCardComponent {

  todo = input.required<Todo>();
  simple = input(false);
}
