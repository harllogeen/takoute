import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService, PaginationMeta } from '../../services/food.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { CartSidebarService } from '../../services/cart-sidebar.service';
import { Food, Category } from '../../models/food.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  foods: Food[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  loading = false;
  error = '';
  cartCount = 0;
  cartSubtotal = 0;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  pagination: PaginationMeta = { page: 1, limit: 20, total: 0, totalPages: 0 };

  private searchSubject = new Subject<string>();

  constructor(
    private foodService: FoodService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private cartSidebarService: CartSidebarService,
    private router: Router
  ) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.loadFoods();
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadFoods();

    // Track cart for floating bar
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      this.cartSubtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        // API returns data as array directly OR as { categories: [] }
        if (response.success) {
          this.categories = Array.isArray(response.data)
            ? response.data
            : response.data.categories || [];
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadFoods(): void {
    this.loading = true;
    this.error = '';
    this.foodService.getFoods(this.selectedCategory, this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.foods = response.data.foods;
          this.pagination = response.data.pagination;
        } else {
          this.foods = [];
          this.error = 'Failed to load foods';
        }
        this.loading = false;
        // Scroll to menu top on page change
        const menuSection = document.querySelector('.menu-section');
        if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      error: (err) => {
        this.error = 'Failed to load foods. Please check your connection.';
        this.loading = false;
        this.foods = [];
        console.error('Error:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.currentPage = page;
    this.loadFoods();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const total = this.pagination.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 3) {
      pages.push(1, 2, 3, 4, -1, total);
    } else if (current >= total - 2) {
      pages.push(1, -1, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -1, total);
    }

    return pages;
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.searchTerm = '';
    this.currentPage = 1;
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.loadFoods();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) this.selectedCategory = '';
    this.currentPage = 1;
    this.searchSubject.next(value);
  }

  addToCart(food: Food): void {
    this.cartService.addToCart(food);
    this.showAddedNotification(food.name);
    // No auto-open — user taps the cart icon in the header when ready
  }

  private showAddedNotification(foodName: string): void {
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
      <div class="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-title">${foodName} added</div>
        <div class="toast-message">Tap the cart icon to view</div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }

  getImageUrl(food: Food): string {
    return food.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
  }

  getDrinkType(food: Food): string | null {
    const name = food.name.toLowerCase();
    if (name.includes('coca cola') || name.includes('coke')) return 'coke';
    if (name.includes('fanta')) return 'fanta';
    if (name.includes('sprite')) return 'sprite';
    if (name.includes('water')) return 'water';
    if (name.includes('chapman')) return 'chapman';
    return null;
  }

  // Hero button actions
  orderTakeout(): void {
    const menuSection = document.querySelector('.menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  viewMenu(): void {
    const menuSection = document.querySelector('.search-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToMenu(): void {
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // View all link action
  viewAllMeals(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.currentPage = 1;
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.loadFoods();
  }

  filterByTag(tag: string): void {
    this.selectedCategory = '';
    this.searchTerm = tag;
    this.currentPage = 1;
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) searchInput.value = tag;
    this.loadFoods();
  }

  // Search focus
  focusSearch(): void {
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Get category name for display
  getCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategory);
    return category ? category.name : 'Category';
  }

  // Filter by Swallow category directly (more reliable than text search)
  filterBySwallowCategory(): void {
    const swallowCat = this.categories.find(c => c.name === 'Swallow');
    if (swallowCat) {
      this.filterByCategory(swallowCat.id);
    } else {
      this.filterByTag('swallow');
    }
  }

  // Check if Swallow category is currently active
  isSwallowActive(): boolean {
    const swallowCat = this.categories.find(c => c.name === 'Swallow');
    return !!swallowCat && this.selectedCategory === swallowCat.id;
  }

  // Filter by Soups category directly
  filterBySoupCategory(): void {
    const soupCat = this.categories.find(c => c.name === 'Soups');
    if (soupCat) {
      this.filterByCategory(soupCat.id);
    }
  }

  // Check if Soups category is currently active
  isSoupActive(): boolean {
    const soupCat = this.categories.find(c => c.name === 'Soups');
    return !!soupCat && this.selectedCategory === soupCat.id;
  }

  // Filter to only show available foods
  getAvailableFoods(): Food[] {
    return this.foods.filter(food => food.isAvailable);
  }

  // Page end for display
  getPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.pagination.total);
  }

  getCartCount(): number {
    return this.cartCount;
  }

  getCartTotal(): number {
    return this.cartSubtotal;
  }

  openCart(): void {
    this.cartSidebarService.open();
  }
}
