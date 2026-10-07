import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CartSidebarService } from '../services/cart-sidebar.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private cartSidebarService: CartSidebarService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToMenu(): void {
    this.router.navigate(['/']);
    setTimeout(() => {
      const menuSection = document.querySelector('.menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToCart(): void {
    // Open cart sidebar instead of navigating
    this.cartSidebarService.open();
  }

  showProfile(): void {
    // Use modal instead of browser alert
    this.modalService.info(
      'Profile Feature',
      'Profile management feature is coming soon! You\'ll be able to manage your account, view order history, and save favorite meals.'
    );
  }
}
