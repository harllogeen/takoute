import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ModalService } from '../../services/modal.service';
import { CartItem } from '../../models/food.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  takeoutFee = 500;
  grandTotal = 0;

  constructor(
    private cartService: CartService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartItems = this.cartService.getCartItems();
      this.subtotal = this.cartService.getCartTotal();
      this.grandTotal = this.cartService.getCartGrandTotal();
    });
  }

  updateQuantity(foodId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(foodId, quantity);
  }

  removeItem(foodId: string): void {
    this.modalService.confirm(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      () => {
        this.cartService.removeFromCart(foodId);
      }
    );
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.modalService.warning(
        'Cart Empty',
        'Your cart is empty. Add some items before checking out.'
      );
      return;
    }
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  getImageUrl(item: CartItem): string {
    return item.food.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image';
  }
}
