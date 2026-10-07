import { Component, OnInit } from '@angular/core';
import { CartSidebarService } from './services/cart-sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Takeoute - Order Food Online';
  cartSidebarOpen = false;

  constructor(private cartSidebarService: CartSidebarService) {}

  ngOnInit(): void {
    this.cartSidebarService.isOpen$.subscribe(isOpen => {
      this.cartSidebarOpen = isOpen;
    });
  }

  closeCartSidebar(): void {
    this.cartSidebarService.close();
  }
}
