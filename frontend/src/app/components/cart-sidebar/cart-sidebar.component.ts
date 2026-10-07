import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { ModalService } from '../../services/modal.service';
import { CartItem } from '../../models/food.model';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class CartSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  cartItems: CartItem[] = [];
  cartCount = 0;
  subtotal = 0;
  takeoutFee = 500;
  total = 0;

  constructor(
    private cartService: CartService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    );
    this.total = this.subtotal + this.takeoutFee;
  }

  increaseQuantity(foodId: string): void {
    const item = this.cartItems.find(i => i.food.id === foodId);
    if (item) {
      this.cartService.updateQuantity(foodId, item.quantity + 1);
    }
  }

  decreaseQuantity(foodId: string): void {
    const item = this.cartItems.find(i => i.food.id === foodId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(foodId, item.quantity - 1);
    }
  }

  removeItem(foodId: string): void {
    const item = this.cartItems.find(i => i.food.id === foodId);
    if (!item) return;

    this.modalService.confirm(
      `Remove ${item.food.name}?`,
      'This item will be removed from your cart.',
      () => {
        this.cartService.removeFromCart(foodId);
      }
    );
  }

  clearCart(): void {
    this.modalService.confirm(
      'Clear Cart?',
      'Are you sure you want to remove all items from your cart?',
      () => {
        this.cartService.clearCart();
        this.modalService.success('Cart Cleared', 'All items have been removed.');
      }
    );
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.modalService.warning('Cart is Empty', 'Please add items to your cart first.');
      return;
    }
    this.close();
    this.router.navigate(['/checkout']);
  }

  close(): void {
    this.closeSidebar.emit();
  }

  getImageUrl(item: CartItem): string {
    return item.food.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
  }
}
