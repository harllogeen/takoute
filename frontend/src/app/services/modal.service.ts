import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  public modal$ = this.modalSubject.asObservable();

  success(title: string, message: string) {
    this.show({
      title,
      message,
      type: 'success',
      confirmText: 'OK'
    });
  }

  error(title: string, message: string) {
    this.show({
      title,
      message,
      type: 'error',
      confirmText: 'OK'
    });
  }

  warning(title: string, message: string) {
    this.show({
      title,
      message,
      type: 'warning',
      confirmText: 'OK'
    });
  }

  info(title: string, message: string) {
    this.show({
      title,
      message,
      type: 'info',
      confirmText: 'OK'
    });
  }

  confirm(title: string, message: string, onConfirm?: () => void, onCancel?: () => void) {
    this.show({
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm,
      onCancel
    });
  }

  show(config: ModalConfig) {
    this.modalSubject.next(config);
  }

  close() {
    this.modalSubject.next(null);
  }
}
