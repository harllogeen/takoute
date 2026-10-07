import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ModalService } from '../../services/modal.service';
import { Order, CartItem } from '../../models/food.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  loading = false;
  error = '';

  customerName = '';
  customerPhone = '';
  customerEmail = '';
  deliveryAddress = '';
  notes = '';
  paymentMethod = 'PAY_ON_DELIVERY';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getCartTotal();

    if (this.cartItems.length === 0) {
      this.modalService.warning(
        'Cart Empty',
        'Your cart is empty. Please add items before checking out.'
      );
      this.router.navigate(['/']);
    }
  }

  placeOrder(): void {
    // Validate form
    if (!this.customerName || !this.customerPhone || !this.deliveryAddress) {
      this.modalService.warning(
        'Missing Information',
        'Please fill in all required fields to complete your order.'
      );
      return;
    }

    // Validate phone number (Nigerian format)
    const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
    if (!phoneRegex.test(this.customerPhone)) {
      this.modalService.error(
        'Invalid Phone Number',
        'Please enter a valid Nigerian phone number (e.g., 08012345678)'
      );
      return;
    }

    this.loading = true;
    this.error = '';

    const order: Order = {
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
      deliveryAddress: this.deliveryAddress,
      notes: this.notes,
      paymentMethod: this.paymentMethod,
      totalAmount: this.total,
      items: this.cartItems.map(item => ({
        foodId: item.food.id,
        quantity: item.quantity,
        price: item.food.price
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        if (response.success) {
          // Clear cart
          this.cartService.clearCart();
          
          // Show success modal
          this.modalService.success(
            'Order Placed Successfully!',
            `Your order #${response.data.orderNumber} has been confirmed. Check WhatsApp for details.`
          );
          
          // Open WhatsApp
          if (response.data.whatsappUrl) {
            window.open(response.data.whatsappUrl, '_blank');
          }
          
          // Redirect to home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to place order. Please try again.';
        this.modalService.error(
          'Order Failed',
          this.error
        );
        this.loading = false;
        console.error('Order error:', err);
      }
    });
  }
}
