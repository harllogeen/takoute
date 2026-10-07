import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartSidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  constructor() {}

  open(): void {
    this.isOpenSubject.next(true);
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpenSubject.next(false);
    // Restore body scroll
    document.body.style.overflow = '';
  }

  toggle(): void {
    if (this.isOpenSubject.value) {
      this.close();
    } else {
      this.open();
    }
  }
}
