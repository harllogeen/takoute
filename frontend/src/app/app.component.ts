import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartSidebarService } from './services/cart-sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Takeoute - Order Food Online';
  cartSidebarOpen = false;

  constructor(
    private cartSidebarService: CartSidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSidebarService.isOpen$.subscribe(isOpen => {
      this.cartSidebarOpen = isOpen;
    });

    // Scroll to top on every route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  closeCartSidebar(): void {
    this.cartSidebarService.close();
  }
}
