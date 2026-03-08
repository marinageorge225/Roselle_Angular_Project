import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { CalcPipe } from '../../pipes/calc-pipe-pipe';
import { HighlightCard } from '../../directives/highlight-card';
import { StaticProducts } from '../../services/static-products';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgClass, CalcPipe, HighlightCard, RouterLink, RouterLinkActive],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnChanges {
  @Input() recievedID: number = 0;
  @Input() overrideProducts: IProduct[] | null = null;
  @Output() total = new EventEmitter<number>();

  totalPrice: number = 0;
  products: IProduct[] = [];
  filteratedList: IProduct[] = [];
  addedToCartId: number | null = null;

  constructor(
    private prdService: StaticProducts,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products = this.prdService.getAllProducts();
    this.FilterationList();
  }

  ngOnChanges(): void { this.FilterationList(); }

  FilterationList() {
    if (this.overrideProducts !== null) {
      this.filteratedList = this.overrideProducts;
      return;
    }
    this.filteratedList = this.recievedID === 0
      ? this.products
      : this.prdService.getProductByCatId(this.recievedID);
  }

  addToCart(p: IProduct) {
    // Use live stock from service
    const live = this.prdService.getProductById(p.id);
    if (!live || live.quantity <= 0) return;

    this.cartService.addToCart(live);
    this.totalPrice += live.price;
    this.total.emit(this.totalPrice);

    this.addedToCartId = p.id;
    setTimeout(() => this.addedToCartId = null, 800);
    // No auto-navigate — user sees the updated stock immediately
  }

  toggleWishlist(p: IProduct, event: MouseEvent) {
    event.stopPropagation();
    this.authService.toggleWishlist(p.id);
  }

  isInWishlist(id: number): boolean { return this.authService.isInWishlist(id); }
  isInCart(id: number): boolean { return this.cartService.isInCart(id); }

  // Live stock from the source (reflects cart deductions)
  liveStock(id: number): number {
    return this.prdService.getProductById(id)?.quantity ?? 0;
  }

  navigateToDetails(id: number) { this.router.navigate(['/Details', id]); }
}
