import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';

@Component({
  selector: 'app-root',
  imports: [
    CategoryComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('travelapp-frontend');
}
