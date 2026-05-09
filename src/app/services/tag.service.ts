import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Tag } from '../model/tag';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  // private url = 'http://localhost:9090/tags';
  private url:string = `${environment.HOST}/tags`;

  private readonly http = inject(HttpClient);

  findAll(){
    return this.http.get<Tag[]>(this.url);
  }
}
