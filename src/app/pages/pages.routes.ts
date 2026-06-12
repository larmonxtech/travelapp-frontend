import { CategoryEditComponent } from './category/category-edit/category-edit.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExperienceComponent } from './experience/experience.component';
import { TagComponent } from './tag/tag.component';

export const pagesRoutes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'category',
    component: CategoryComponent,
    children: [
      { path: 'new', component: CategoryEditComponent },
      { path: 'edit/:id', component: CategoryEditComponent },
    ],
  },
  { path: 'tag', component: TagComponent },
  { path: 'experience', component: ExperienceComponent },
];
