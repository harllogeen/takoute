import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartSidebarService } from '../../services/cart-sidebar.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  cartBounce = false;

  constructor(
    private cartService: CartService,
    private cartSidebarService: CartSidebarService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      const newCount = this.cartService.getCartCount();
      if (newCount > this.cartCount) {
        // Trigger bounce animation on add
        this.cartBounce = false;
        setTimeout(() => this.cartBounce = true, 10);
        setTimeout(() => this.cartBounce = false, 400);
      }
      this.cartCount = newCount;
    });
  }

  goToCart(): void {
    // Open cart sidebar instead of navigating
    this.cartSidebarService.open();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  focusSearch(): void {
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  showProfileMenu(): void {
    // Use modal instead of browser alert
    this.modalService.info(
      'Profile Feature',
      'Profile management feature is coming soon! You\'ll be able to manage your account, view order history, and save favorite meals.'
    );
  }
}
