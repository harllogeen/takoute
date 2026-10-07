import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addToCart(food: Food, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.food.id === food.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ food, quantity });
    }
    
    this.saveCart();
  }

  removeFromCart(foodId: string): void {
    this.cartItems = this.cartItems.filter(item => item.food.id !== foodId);
    this.saveCart();
  }

  updateQuantity(foodId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.food.id === foodId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(foodId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.food.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }
}
