import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { IProduct } from '../../models/iproduct';

import { CommonModule, NgClass } from '@angular/common';
import { CalcPipe } from '../../pipes/calc-pipe-pipe';
import { HighlightCard } from '../../directives/highlight-card';

@Component({
  selector: 'app-products',
  imports: [CalcPipe, NgClass , CommonModule, HighlightCard],
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
    id: 1,
    name: 'The Signature Ivory Suit',
    price: 5200,
    quantity: 3,
    imgUrl: 'assets/images/img1.jpg',
    categoryId: 1,
    description: 'Impeccably tailored silhouette crafted for timeless elegance and modern sophistication.'
  },
  {
    id: 2,
    name: 'Midnight Elegance Blazer Set',
    price: 4800,
    quantity: 2,
    imgUrl: 'assets/images/img2.jpg',
    categoryId: 1,
    description: 'A refined short blazer ensemble designed for confident and effortless luxury.'
  },

  // --- Luxury Bags (categoryId: 2) ---
  {
    id: 3,
    name: 'Luxe Beige Mini Bag',
    price: 2800,
    quantity: 5,
    imgUrl: 'assets/images/img3.jpg',
    categoryId: 2,
    description: 'Premium textured leather accented with a delicate gold-tone accessories and chain.'
  },
  {
    id: 4,
    name: 'The Executive Leather Tote',
    price: 3500,
    quantity: 4,
    imgUrl: 'assets/images/img4.jpg',
    categoryId: 2,
    description: 'Spacious structured design crafted from finest leather for everyday luxury.'
  },

  // --- Shoes (categoryId: 3) ---
  {
    id: 5,
    name: 'Royal Stiletto Heels',
    price: 2100,
    quantity: 4,
    imgUrl: 'assets/images/img5.jpg',
    categoryId: 3,
    description: 'Elegant Italian craftsmanship with a sleek 10cm heel for a graceful statement.'
  },
  {
    id: 6,
    name: 'Velvet Wine Heels',
    price: 1800,
    quantity: 2,
    imgUrl: 'assets/images/img6.jpg',
    categoryId: 3,
    description: 'Rich tone and refined finish red heels designed for evening sophistication and nights.'
  },

  // --- Coats (categoryId: 4) ---
  {
    id: 7,
    name: 'Heritage Wool Coat',
    price: 6500,
    quantity: 3,
    imgUrl: 'assets/images/img7.jpg',
    categoryId: 4,
    description: 'Luxury double-breasted coat made from premium wool for timeless winter elegance.'
  },
  {
    id: 8,
    name: 'The Nude Trench Classic',
    price: 3900,
    quantity: 2,
    imgUrl: 'assets/images/img8.jpg',
    categoryId: 4,
    description: 'Minimalist belted trench designed for effortless sophistication in every season.'
  },

  // --- Dresses (categoryId: 5) ---
  {
    id: 9,
    name: 'Golden Grace Evening Dress',
    price: 4500,
    quantity: 3,
    imgUrl: 'assets/images/img9.jpg',
    categoryId: 5,
    description: 'Long Flowing silhouette with subtle gold accents for refined evening glamour.'
  },
  {
    id: 10,
    name: 'Noir Lace Couture Dress',
    price: 5800,
    quantity: 1,
    imgUrl: 'assets/images/img10.jpg',
    categoryId: 5,
    description: 'Hand-finished lace detailing that embodies elegance, mystery, and couture luxury.'
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