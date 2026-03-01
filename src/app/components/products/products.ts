import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule, NgClass } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { CalcPipe } from '../../pipes/calc-pipe-pipe';
import { HighlightCard } from '../../directives/highlight-card';
import { StaticProducts } from '../../services/static-products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgClass, CalcPipe, HighlightCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnChanges {

  @Input() recievedID: number = 0;
  @Output() total = new EventEmitter<number>();

  totalPrice: number = 0;
  products: IProduct[] = [];
  filteratedList: IProduct[] = [];

  constructor(private prdService: StaticProducts) {}
//products list
  ngOnInit(): void {
    this.products = this.prdService.getAllProducts();
    this.FilterationList();
  }

  ngOnChanges(): void {
    this.FilterationList();
  }

  FilterationList() {
    if (this.recievedID == 0) {
      this.filteratedList = this.products;
    } else {
      this.filteratedList =
        this.prdService.getProductByCatId(this.recievedID);
    }
  }

  addToCart(p: IProduct) {
    if (p.quantity === 0) return;

    this.totalPrice += p.price;
    this.total.emit(this.totalPrice);
    p.quantity--;
  }
}