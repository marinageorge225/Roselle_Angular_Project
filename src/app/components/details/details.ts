import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StaticProducts } from '../../services/static-products';

import { IProduct } from '../../models/iproduct';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  currentId: number = 0;
  product: IProduct | null = null;
  addedToCart: boolean = false; // for button feedback

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _detailsService: StaticProducts,
    private _cartService: CartService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.product = this._detailsService.getProductById(this.currentId);
    // sync button state if already in cart
    if (this.product) {
      this.addedToCart = this._cartService.isInCart(this.product.id);
    }
  }

  addToCart(): void {
    if (this.product && this.product.quantity > 0) {
      this._cartService.addToCart(this.product);
      this.addedToCart = true;
    }
  }

  goBack(): void {
    this._location.back();
  }

  get cartCount(): number {
    return this._cartService.getCartCount();
  }
}