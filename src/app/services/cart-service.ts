import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';

// Cart item extends IProduct with a cartQuantity field
export interface ICartItem extends IProduct {
  cartQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: ICartItem[] = [];

  // ── Add or increment ───────────────────────────────
  addToCart(product: IProduct): void {
    const existing = this.cartItems.find((item) => item.id === product.id);
    if (existing) {
      // don't exceed available stock
      if (existing.cartQuantity < product.quantity) {
        existing.cartQuantity++;
      }
    } else {
      this.cartItems.push({ ...product, cartQuantity: 1 });
    }
  }

  // ── Remove one item entirely ───────────────────────
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
  }

  // ── Increment quantity ─────────────────────────────
  increment(productId: number): void {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item && item.cartQuantity < item.quantity) {
      item.cartQuantity++;
    }
  }

  // ── Decrement quantity (remove if reaches 0) ───────
  decrement(productId: number): void {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      item.cartQuantity--;
      if (item.cartQuantity <= 0) {
        this.removeFromCart(productId);
      }
    }
  }

  // ── Clear entire cart ──────────────────────────────
  clearCart(): void {
    this.cartItems = [];
  }

  // ── Getters ────────────────────────────────────────
  getCartItems(): ICartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  }

  getGrandTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.cartQuantity,
      0
    );
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some((item) => item.id === productId);
  }
}