import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryEditComponent } from './pages/category/category-edit/category-edit.component';
import { TagComponent } from './pages/tag/tag.component';
import { ExperienceComponent } from './pages/experience/experience.component';

export const routes: Routes = [
    { 
        path: 'pages/category', component: CategoryComponent,
        children: [
            { path: 'new', component: CategoryEditComponent },
            { path: 'edit/:id', component: CategoryEditComponent },
        ],
    },
    { path: 'pages/tag', component: TagComponent },
    { path: 'pages/experience', component: ExperienceComponent },
];
