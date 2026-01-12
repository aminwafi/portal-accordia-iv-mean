import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../features/item/item.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = `${environment.apiUrl}/item`;

  constructor(private http: HttpClient) {}

  list(): Observable<{ items: Item[] }> {
    return this.http.get<{ items: Item[] }>(`${this.apiUrl}/`);
  }

  get(id: string): Observable<{ item: Item }> {
    return this.http.get<{ item: Item }>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/`, data);
  }

  update(id: string, data: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<Item> {
    return this.http.delete<Item>(`${this.apiUrl}/${id}`);
  }
}
