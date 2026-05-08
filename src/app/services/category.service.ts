import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = 'http://localhost:9090/categories';

  //constructor(private http: HttpClient){}
  private readonly http = inject(HttpClient);

  // get post put delete
  findAll(){
    return this.http.get<Category[]>(this.url);
  }
}
