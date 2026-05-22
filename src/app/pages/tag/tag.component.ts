import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Tag} from '../../model/tag';
import { TagService } from '../../services/tag.service';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';
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

@Component({
  selector: 'app-tag',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  private readonly tagService = inject(TagService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Tag>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $tags = this.tagService.$listChange;

  protected displayedColumns: string[] = ['idTag', 'name', 'status', 'actions'];

  constructor() {
    this.tagService.findAll().subscribe(data => this.tagService.setListChange(data));

    this.initializeEffects();

  }

  private initializeEffects(){
    effect( () => {
      const data = this.$tags();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    }); 

    effect(() => {
      const message = this.tagService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.tagService.setMessageChange('') );
      }
    });
  }

  openDialog(tag?: Tag){
    this.dialog.open(TagDialogComponent,{
      width: '650px',
      data: tag,
      // disableClose: true
    });
  }

  delete(idTag: number){
      const ok = window.confirm('Are you sure to delete?');
      if(ok){
        this.tagService.delete(idTag)
        .pipe(
          switchMap( () => this.tagService.findAll() ),
          tap( data => this.tagService.setListChange(data) ),
          tap( () => this.tagService.setMessageChange('DELETED') )
        )
        .subscribe();
      }
    }
  
  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
