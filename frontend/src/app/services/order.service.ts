import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, ApiResponse } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<ApiResponse<Order & { whatsappUrl: string }>> {
    return this.http.post<ApiResponse<Order & { whatsappUrl: string }>>(this.apiUrl, order);
  }

  getOrderByNumber(orderNumber: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderNumber}`);
  }
}
