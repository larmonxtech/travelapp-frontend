import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends GenericSignalService<Category> {
  //private url = 'http://localhost:9090/categories';
  protected url:string = `${environment.HOST}/categories`;

  //constructor(private http: HttpClient){}
  /*private readonly http = inject(HttpClient);

  private readonly _categories = signal<Category[]>([]);
  private readonly _message = signal<string>('');

  readonly $categoriesChange = this._categories.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // get post put delete
  findAll(){
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  save(category: Category){
    return this.http.post(this.url, category);
  }

  update(id: number, category: Category){
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ////set////
  setCategoryChange(data: Category[]){
    
    this._categories.set(data);
  }

  setMessageChange(msg: string){
    this._message.set(msg);
  }
    */
}
