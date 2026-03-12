// import { Component, OnInit } from '@angular/core';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CartService } from '../../services/cart-service';
// import { StaticProducts } from '../../services/static-products';
// import { IProduct } from '../../models/iproduct';

// @Component({
//   selector: 'app-wishlist',
//   standalone: true,
//   imports: [CommonModule, CurrencyPipe, RouterLink],
//   templateUrl: './wishlist.html',
//   styleUrl: './wishlist.css',
// })
// export class Wishlist implements OnInit {
//   wishlistProducts: IProduct[] = [];

//   constructor(
//     private auth: AuthService,
//     private cart: CartService,
//     private products: StaticProducts
//   ) {}

//   ngOnInit(): void {
//     this.loadWishlist();
//   }

//   loadWishlist(): void {
//     const ids = this.auth.wishlist;
//     this.wishlistProducts = ids.map(id => this.products.getProductById(id)).filter(Boolean) as IProduct[];
//   }

//   remove(id: number): void {
//     this.auth.toggleWishlist(id);
//     this.loadWishlist();
//   }

//   addToCart(product: IProduct): void {
//     this.cart.addToCart(product);
//   }

//   isInCart(id: number): boolean {
//     return this.cart.isInCart(id);
//   }

//   get isEmpty(): boolean { return this.wishlistProducts.length === 0; }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist.service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  addingToCartId: string | null = null;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    public wishlistService: WishlistService,
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.wishlistService.loadWishlist().subscribe();
    }
  }

  get wishlistProducts(): IProduct[] {
    return this.wishlistService.wishlistProducts();
  }

  remove(product: IProduct): void {
    this.wishlistService.toggleWishlist(product).subscribe();
  }

  addToCart(product: IProduct): void {
    if (this.isInCart(product._id)) return;
    this.addingToCartId = product._id;
    // CartService.addToCart takes a full IProduct (local, not HTTP)
    this.cart.addToCart(product);
    setTimeout(() => (this.addingToCartId = null), 800);
  }

  isInCart(id: string): boolean {
    return this.cart.isInCart(id);
  }

  get isEmpty(): boolean {
    return this.wishlistProducts.length === 0;
  }
}
