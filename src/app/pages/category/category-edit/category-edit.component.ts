import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Category } from '../../../model/category';
import { switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-category-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule,   
  ],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  protected $form = signal(new FormGroup({
    idCategory: new FormControl<number | null>(null),
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    status: new FormControl<boolean | null>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); //En JS es como decir  !! ¿Existe realmente este dato?, devuelve true o false

  constructor() {
    effect(() => {
      const id = this.$id();
      if(id){
        this.categoryService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  /*ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID:', id);
    });
  }*/

  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const category: Category = form.value as Category;
    /*const patient: Category = new Category();
    category.idCategory = form.value.idCategory;
    category.name = form.value.name;
    category.description = form.value.description;
    category.status = form.value.status;*/

    const operation$ = isEdit ? this.categoryService.update(id, category) : this.categoryService.save(category);

    operation$.pipe(
      switchMap(() => this.categoryService.findAll()),
      // tap(data => this.categoryService.setCategoryChange(data)),
      tap(data => this.categoryService.setListChange(data)),
      tap(() => this.categoryService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/category']);
    });
  }
}
