import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateItem, EditIem, Item, ItemStatus } from './models/item';
import { Observable } from 'rxjs';
import { ENV_CONFIG } from '../env.config';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // readonly URL = 'http://localhost:3000/items'; //old
  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/items`;

  private httpClient = inject(HttpClient)

  constructor() { }

  // list() { //or
  list(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.URL);
  }

  add(item: CreateItem) {
    return this.httpClient.post<Item>(this.URL, item);
  }

  get(id: number) {
    return this.httpClient.get<Item>(`${this.URL}/${id}`)
  }
  
  edit(id: number, item: EditIem) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}`, item);
  }

  delete(id: number) {
    return this.httpClient.delete<void>(`${this.URL}/${id}`);
  } 

  approve(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}`, { status: ItemStatus.APPROVED });
  }

  reject(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}`, { status: ItemStatus.REJECTED });
  }
}
