import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, ICartItem } from '../../services/cart-service';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './view-cart.html',
  styleUrl: './view-cart.css',
})
export class ViewCart implements OnInit {
  cartItems: ICartItem[] = [];

  constructor(private _cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this._cartService.getCartItems();
  }

  increment(id: number): void {
    this._cartService.increment(id);
  }

  decrement(id: number): void {
    this._cartService.decrement(id);
    // re-assign so Angular picks up the array mutation
    this.cartItems = this._cartService.getCartItems();
  }

  remove(id: number): void {
    this._cartService.removeFromCart(id);
    this.cartItems = this._cartService.getCartItems();
  }

  clearCart(): void {
    this._cartService.clearCart();
    this.cartItems = this._cartService.getCartItems();
  }

  get grandTotal(): number {
    return this._cartService.getGrandTotal();
  }

  get cartCount(): number {
    return this._cartService.getCartCount();
  }
}