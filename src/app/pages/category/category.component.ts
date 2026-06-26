import { Component, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {

  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);

  // protected $categories = toSignal<Category[]>(this.categoryService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Category>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  //Enlaza con el signal del service para que cada vez que haya un cambio en los pacientes, se actualice la tabla
  // protected $categories = this.categoryService.$categoriesChange;
  // protected $categories = this.categoryService.$listChange;

  protected displayedColumns: string[] = ['idCategory', 'name', 'description', 'status', 'actions'];

  //Signal de la paginacion
  protected $pageRequest = signal({page: 0, size: 10});

  //Signal que escucha los cambios en la paginacion y ejecuta la consulta al backend cada vez que haya un cambio en la paginacion
  private readonly $response = toSignal(
    //toObservable tiene effect interno, que desencadena todo lo de abajo cada vez que haya un cambio en $pageRequest
    toObservable(this.$pageRequest).pipe(
      switchMap( ({page, size}) => this.categoryService.listPageable(page, size) ),
      tap(data => this.categoryService.setListChange(data.content)),
    )
  );

  //Signals calculados para obtener los datos y el total de elementos de la respuesta
  protected $categories = computed(() => this.$response()?.content ?? []);
  protected $totalElements = computed(() => this.$response()?.page?.totalElements ?? 0);
  
  //Esta esuchando los signals de categoria, paginador y sort para actualizar la tabla cada vez que haya un cambio
  constructor() {
    // this.categoryService.findAll().subscribe(data => this.categoryService.setCategoryChange(data));
    this.categoryService.findAll().subscribe(data => this.categoryService.setListChange(data));

    effect( () => {
      const data = this.$categories();
      // const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      // ds.paginator = p;
      ds.sort = s;
    }); 
    
    effect(() => {
      const message = this.categoryService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //this.categoryService.setMessageChange('');
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.categoryService.setMessageChange('') );
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idCategory: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.categoryService.delete(idCategory)
      .pipe(
        switchMap( () => this.categoryService.findAll() ),
        // tap( data => this.categoryService.setCategoryChange(data) ),
        tap( data => this.categoryService.setListChange(data) ),
        tap( () => this.categoryService.setMessageChange('DELETED') )
      )
      .subscribe();
    }
  }

  changePage(e: any){
    this.$pageRequest.set({page: e.pageIndex, size: e.pageSize});
  }

  /*
  protected categories : Category[] = [];
  protected $dataSource = signal(new MatTableDataSource<Category>());
  //protected dataSource2$ = new Observable<MatTableDataSource<Category>>();
  protected displayedColumns: string[] = ['idCategory', 'name', 'description', 'status'];

  private readonly categoryService = inject(CategoryService);

  ngOnInit() : void{
    // this.categoryService.findAll().subscribe(data => console.log(data));
    //this.categoryService.findAll().subscribe(data => this.categories = data);
    this.categoryService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Category>(data));
    });
  }

  applyFilter(e: any){
   console.log(e);
  }
*/
  
}
