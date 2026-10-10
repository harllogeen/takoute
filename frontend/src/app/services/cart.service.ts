import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Food } from '../models/food.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();
  private readonly CART_KEY = 'cart';
  private readonly API_KEY = 'cart_api_url';

  constructor() {
    // Check if API URL changed (production vs localhost) and clear cart if different
    this.checkAndClearStaleCart();
    // Load cart from localStorage
    this.loadCart();
  }

  private checkAndClearStaleCart(): void {
    const savedApiUrl = localStorage.getItem(this.API_KEY);
    const currentApiUrl = environment.apiUrl;

    if (savedApiUrl && savedApiUrl !== currentApiUrl) {
      // API changed (localhost → production or vice versa), clear cart
      console.log('API URL changed, clearing cart to prevent ID mismatch');
      localStorage.removeItem(this.CART_KEY);
    }

    // Save current API URL
    localStorage.setItem(this.API_KEY, currentApiUrl);
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems));
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

  readonly TAKEOUT_FEE = 500;

  getCartGrandTotal(): number {
    return this.getCartTotal() + this.TAKEOUT_FEE;
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }
}
