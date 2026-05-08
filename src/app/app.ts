import { Component, signal } from '@angular/core';
import { CategoryComponent } from './pages/category/category.component';
import { TagComponent } from './pages/tag/tag.component';

@Component({
  selector: 'app-root',
  imports: [
    CategoryComponent,
    TagComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('travelapp-frontend');
}
