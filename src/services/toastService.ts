import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  protected show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showInfo(textOrTpl: string | TemplateRef<any>, delay:number = 1000){
	this.show(textOrTpl, { classname: 'bg-info text-light', delay: delay });
  }

  showSuccess(textOrTpl: string | TemplateRef<any>, delay:number = 1000){
	this.show(textOrTpl, { classname: 'bg-success text-light', delay: delay });
  }

  showWarning(textOrTpl: string | TemplateRef<any>, delay:number = 3000){
	this.show(textOrTpl, { classname: 'bg-warning text-light', delay: delay });
  }

  showError(textOrTpl: string | TemplateRef<any>, delay:number = 3000){
	this.show(textOrTpl, { classname: 'bg-danger text-light', delay: delay });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}