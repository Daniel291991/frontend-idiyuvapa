import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  getCart() {
    return this.cartSubject.value;
  }

  addToCart(item: any) {
    const cart = [...this.cartSubject.value, item];
    this.cartSubject.next(cart);
  }

  removeFromCart(guid: string, pack: string) {
    const cart = this.cartSubject.value.filter(i => i.Guid !== guid || i.pack !== pack);
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }
  
}