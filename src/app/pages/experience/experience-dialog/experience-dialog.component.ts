import { Component, inject, signal, OnInit } from '@angular/core';
import { ExperienceService } from '../../../services/experience.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-experience-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './experience-dialog.component.html',
  styleUrl: './experience-dialog.component.css',
})
export class ExperienceDialogComponent implements OnInit {
  private readonly experienceService = inject(ExperienceService);
  private readonly categoryService = inject(CategoryService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ExperienceDialogComponent>);

  protected $experience = signal({ ... this.data });
  protected categories: Category[] = [];
  
  ngOnInit(): void {
    this.categoryService.findAll().subscribe(data => this.categories = data);
  }

  operate(){
    const experience = this.$experience();
    const isEdit = experience != null && experience.idExperience > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    const operation$ = isEdit ? this.experienceService.update(experience.idExperience, experience) : this.experienceService.save(experience); 

    operation$.pipe(
      switchMap(() => this.experienceService.findAll()),
      tap(data => this.experienceService.setListChange(data)),
      tap( () => this.experienceService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}
