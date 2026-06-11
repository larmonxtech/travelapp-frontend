import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ExperienceService } from '../../../services/experience.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { MatSelectModule } from '@angular/material/select';
import { Experience } from '../../../model/experience';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-experience-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './experience-dialog.component.html',
  styleUrl: './experience-dialog.component.css',
})
export class ExperienceDialogComponent {
  private readonly experienceService = inject(ExperienceService);
  private readonly categoryService = inject(CategoryService);
  private readonly data = inject<Experience>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ExperienceDialogComponent>);

  protected $form = signal(new FormGroup({
    idExperience: new FormControl<number>(this.data?.idExperience || null),
    idCategory: new FormControl<number>(this.data?.idCategory || 0, [Validators.required]),
    name: new FormControl<string>(this.data?.name || '', [Validators.required]),
    description: new FormControl<string>(this.data?.description || '', [Validators.required]),
    coverPhotoUrl: new FormControl<string>(this.data?.coverPhotoUrl || ''),
    duracionHoras: new FormControl<number | null>(this.data?.duracionHoras || 0, [Validators.required]),
    maxCapacity: new FormControl<number | null>(this.data?.maxCapacity || 0, [Validators.required]),
    precioUnitario: new FormControl<number | null>(this.data?.precioUnitario || 0, [Validators.required]),
    experienceType: new FormControl<string>(this.data?.experienceType || '', [Validators.required]),
    estado: new FormControl<boolean>(this.data?.estado || true, [Validators.required]),
  }));
  
  protected $categories = toSignal(this.categoryService.findAll(), { initialValue: [] });
  protected $isEdit = computed(() => this.$form().value.idExperience > 0);
  protected $f = computed(() => this.$form().controls);

  operate(){
    if (this.$form().invalid) return;

    const experience: Experience = this.$form().value as Experience;
    const isEdit = experience.idExperience != null && experience.idExperience > 0;
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
