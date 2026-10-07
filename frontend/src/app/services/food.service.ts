import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Food, ApiResponse } from '../models/food.model';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = `${environment.apiUrl}/foods`;

  private noCache = new HttpHeaders({
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });

  constructor(private http: HttpClient) {}

  getFoods(
    categoryId?: string,
    search?: string,
    page: number = 1,
    limit: number = 20
  ): Observable<ApiResponse<{ foods: Food[]; pagination: PaginationMeta }>> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());
    params = params.set('_t', Date.now().toString());
    if (categoryId) params = params.set('categoryId', categoryId);
    if (search)     params = params.set('search', search);

    return this.http.get<ApiResponse<{ foods: Food[]; pagination: PaginationMeta }>>(
      this.apiUrl, { params, headers: this.noCache }
    ).pipe(timeout(10000));
  }

  getFoodById(id: string): Observable<ApiResponse<Food>> {
    return this.http.get<ApiResponse<Food>>(
      `${this.apiUrl}/${id}`, { headers: this.noCache }
    ).pipe(timeout(10000));
  }
}
