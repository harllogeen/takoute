import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, ApiResponse } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  private noCache = new HttpHeaders({
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<{ categories: Category[] }>> {
    const params = new HttpParams().set('_t', Date.now().toString());
    return this.http.get<ApiResponse<{ categories: Category[] }>>(this.apiUrl, { params, headers: this.noCache });
  }

  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`, { headers: this.noCache });
  }
}
