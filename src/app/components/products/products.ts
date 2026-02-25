import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { IProduct } from '../../models/iproduct';

import { CommonModule, NgClass } from '@angular/common';
import { CalcPipe } from '../../pipes/calc-pipe-pipe';

@Component({
  selector: 'app-products',
  imports: [CalcPipe, NgClass , CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnChanges {
  @Input() recievedID: number = 0;
  @Output() total = new EventEmitter<number>();

  totalPrice: number = 0;
  filteratedList: IProduct[] = [];

  products: IProduct[] = [

  // --- Elegant Suits (categoryId: 1) ---
  {
    id: 1, name: 'Beige Classic Blazer Set', price: 5200, quantity: 3,
    imgUrl: 'assets/images/img1.jpg',
    categoryId: 1, description: 'Premium tailored feminine suit'
  },
  {
    id: 2, name: 'Black Short Classic Blazer Set', price: 4800, quantity: 2,
    imgUrl: 'assets/images/img2.jpg',
    categoryId: 1, description: 'Elegant blazer with matching trousers'
  },

  // --- Luxury Bags (categoryId: 2) ---
  {
    id: 3, name: 'Gold Chain Mini Bag', price: 2800, quantity: 5,
    imgUrl: "assets/images/img3.jpg",
    categoryId: 2, description: 'Nude leather with gold chain'
  },
  {
    id: 4, name: 'Premium Leather Tote', price: 3500, quantity: 4,
    imgUrl: 'assets/images/img4.jpg',
    categoryId: 2, description: 'Spacious luxury everyday tote'
  },

  // --- Shoes (categoryId: 3) ---
  {
    id: 5, name: 'Nude Stiletto Heel', price: 2100, quantity: 4,
    imgUrl: 'assets/images/img5.jpg',
    categoryId: 3, description: 'Italian leather, 10cm heel'
  },
  {
    id: 6, name: 'Wine Heels', price: 1800, quantity: 2,
    imgUrl: 'assets/images/img6.jpg',
    categoryId: 3, description: 'Metallic finish, open toe'
  },

  // --- Coats (categoryId: 4) ---
  {
    id: 7, name: 'Camel Wool Coat', price: 6500, quantity: 3,
    imgUrl: 'assets/images/img7.jpg',
    categoryId: 4, description: 'Double-breasted 100% wool'
  },
  {
    id: 8, name: 'Nude Trench Coat', price: 3900, quantity: 2,
    imgUrl: 'assets/images/img8.jpg',
    categoryId: 4, description: 'Classic belted silhouette'
  },

  // --- Dresses (categoryId: 5) ---
  {
    id: 9, name: 'Silk Midnight Gown', price: 4500, quantity: 3,
    imgUrl: 'assets/images/img9.jpg',
    categoryId: 5, description: 'Flowing silk with gold trim'
  },
  {
    id: 10, name: 'Ivory Lace Dress', price: 5800, quantity: 1,
    imgUrl: 'assets/images/img10.jpg',
    categoryId: 5, description: 'Hand-embroidered lace detail'
  }
];
  ngOnInit(): void {
    if (this.recievedID === 0) {
      this.filteratedList = this.products;
    }
  }

  ngOnChanges(): void {
    this.FilterationList();
  }

  FilterationList() {
    if (+this.recievedID === 0) {
      this.filteratedList = this.products;
    } else {
      this.filteratedList = this.products.filter(el => el.categoryId === +this.recievedID);
    }
  }

  addToCart(p: IProduct) {
    if (p.quantity === 0) return;
    this.totalPrice += p.price;
    this.total.emit(this.totalPrice);
    p.quantity -= 1;
  }
}