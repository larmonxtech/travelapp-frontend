import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Experience } from '../../model/experience';
import { ExperienceService } from '../../services/experience.service';
import { ExperienceDialogComponent } from './experience-dialog/experience-dialog.component';
import { switchMap, tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-experience',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    CurrencyPipe
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  private readonly experienceService = inject(ExperienceService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Experience>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $experiences = this.experienceService.$listChange;
  protected $categories = toSignal(this.categoryService.findAll(), { initialValue: [] });

  protected displayedColumns: string[] = ['idExperience','categoryName', 'name', 'description', 'precioUnitario', 'estado', 'actions'];

  constructor() {
    this.experienceService.findAll().subscribe(data => this.experienceService.setListChange(data));

    this.initializeEffects();

  }

  private initializeEffects(){
    effect( () => {
      const data = this.$experiences();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    }); 

    effect(() => {
      const message = this.experienceService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        untracked( () => this.experienceService.setMessageChange('') );
      }
    });
  }

  getCategoryName(idCategory: number) {
    const category = this.$categories().find(c => c.idCategory === idCategory);
    return category ? category.name : 'N/A';
  }

  openDialog(experience?: Experience){
    this.dialog.open(ExperienceDialogComponent,{
      width: '650px',
      data: experience,
    });
  }

  delete(idExperience: number){
      const ok = window.confirm('Are you sure to delete?');
      if(ok){
        this.experienceService.delete(idExperience)
        .pipe(
          switchMap( () => this.experienceService.findAll() ),
          tap( data => this.experienceService.setListChange(data) ),
          tap( () => this.experienceService.setMessageChange('DELETED') )
        )
        .subscribe();
      }
    }
  
  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
