import { Component, OnInit } from '@angular/core';
import { Products } from '../products/products';
import { ICategory } from '../../models/icategory';
import { NgClass, CommonModule } from '@angular/common';
import { StaticProducts } from '../../services/static-products';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart-service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-master-products',
  standalone: true,
  imports: [CommonModule, Products, NgClass, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './master-products.html',
  styleUrl: './master-products.css',
})
export class MasterProducts implements OnInit {
  selectedCatId: number = 0;
  catList: ICategory[] = [];

  searchTerm = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  filteredProducts: IProduct[] = [];
  allProducts: IProduct[] = [];

  constructor(
    private _prdService: StaticProducts,
    private auth: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.catList = this._prdService.getAllCategories();
    this.allProducts = this._prdService.getAllProducts();
    this.applyFilters();
  }

  // Read live from CartService — always accurate even after navigation
  get cartCount(): number  { return this.cartService.getCartCount(); }
  get grandTotal(): number { return this.cartService.getGrandTotal(); }

  // Keep EventEmitter wired (products child still emits) but we don't need it for display
  receiveTotal(_total: number) { /* no-op — grandTotal is now a live getter */ }

  selectCategory(id: number) {
    this.selectedCatId = id;
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.selectedCatId === 0
      ? this.allProducts
      : this.allProducts.filter(p => p.categoryId === this.selectedCatId);

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    if (this.minPrice !== null) list = list.filter(p => p.price >= this.minPrice!);
    if (this.maxPrice !== null) list = list.filter(p => p.price <= this.maxPrice!);

    this.filteredProducts = list;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  get featuredProducts(): IProduct[] {
    const ids = this.auth.featuredProductIds();
    return this.allProducts.filter(p => ids.includes(p.id));
  }

  get activeBanners() { return this.auth.activeBanners; }
}
