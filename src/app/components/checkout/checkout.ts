import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, ICartItem } from '../../services/cart-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartItems: ICartItem[] = [];
  step = 1;

  isGuest = false;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  address = '';
  city = '';
  governorate = '';

  paymentMethod = 'credit';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  promoCode = '';
  promoApplied = false;
  promoDiscount = 0;
  promoError = '';

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.cartItems = this.cartService.getCartItems();
    const user = this.auth.currentUser();
    if (user) {
      this.email = user.email;
      this.firstName = user.name.split(' ')[0];
      this.lastName = user.name.split(' ').slice(1).join(' ');
      if (user.address) this.address = user.address;
    }
    if (this.cartItems.length === 0) this.router.navigate(['/cart']);
  }

  get subtotal(): number { return this.cartService.getGrandTotal(); }
  get shipping(): number { return this.subtotal >= 1000 ? 0 : 80; }
  get discount(): number { return this.promoApplied ? this.promoDiscount : 0; }
  get total(): number { return this.subtotal + this.shipping - this.discount; }

  applyPromo(): void {
    const promo = this.auth.validatePromoCode(this.promoCode);
    if (promo) {
      this.promoDiscount = promo.discountType === 'percent'
        ? Math.round(this.subtotal * promo.discountValue / 100)
        : promo.discountValue;
      this.promoApplied = true;
      this.promoError = '';
    } else {
      this.promoApplied = false;
      this.promoDiscount = 0;
      this.promoError = 'Invalid or inactive promo code.';
    }
  }

  nextStep(): void { if (this.step < 3) this.step++; }
  prevStep(): void { if (this.step > 1) this.step--; }

  placeOrder(): void {
    if (this.promoApplied) this.auth.usePromoCode(this.promoCode);
    const order = this.auth.placeOrder({
      items: this.cartItems,
      subtotal: this.subtotal,
      shipping: this.shipping,
      discount: this.discount,
      promoCode: this.promoApplied ? this.promoCode : undefined,
      total: this.total,
      paymentMethod: this.paymentMethod,
      address: `${this.address}, ${this.city}, ${this.governorate}`,
      customerName: `${this.firstName} ${this.lastName}`,
      email: this.email,
    });
    this.cartService.clearCart();
    this.router.navigate(['/order-confirmation'], { state: { order } });
  }
}
