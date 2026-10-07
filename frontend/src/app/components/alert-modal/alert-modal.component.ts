import { Component, OnInit } from '@angular/core';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  modal: ModalConfig | null = null;
  isVisible = false;
  isAnimating = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe(modal => {
      if (modal) {
        this.modal = modal;
        this.show();
      } else {
        this.hide();
      }
    });
  }

  private show(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isAnimating = true;
    }, 10);
  }

  private hide(): void {
    this.isAnimating = false;
    setTimeout(() => {
      this.isVisible = false;
      this.modal = null;
    }, 300);
  }

  onConfirm(): void {
    if (this.modal?.onConfirm) {
      this.modal.onConfirm();
    }
    this.modalService.close();
  }

  onCancel(): void {
    if (this.modal?.onCancel) {
      this.modal.onCancel();
    }
    this.modalService.close();
  }

  onBackdropClick(): void {
    if (this.modal?.type !== 'confirm') {
      this.modalService.close();
    }
  }

  getIcon(): string {
    switch (this.modal?.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'confirm':
        return '?';
      default:
        return '';
    }
  }
}
