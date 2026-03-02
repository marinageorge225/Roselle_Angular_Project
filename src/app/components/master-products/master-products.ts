import { Component, OnInit } from '@angular/core';
import { Products } from '../products/products';
import { ICategory } from '../../models/icategory';
import { NgClass, CommonModule } from '@angular/common';
import { StaticProducts } from '../../services/static-products';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-master-products',
  standalone: true,
  imports: [CommonModule, Products, NgClass ,  RouterLink, RouterLinkActive],
  templateUrl: './master-products.html',
  styleUrl: './master-products.css',
})
export class MasterProducts implements OnInit {

  selectedCatId: number = 0;
  grandTotal: number = 0;
  cartCount: number = 0;
  catList: ICategory[] = []; //delte from here and put in service 

  constructor(private _prdService: StaticProducts) {}

  ngOnInit(): void {
    this.catList = this._prdService.getAllCategories();
  }

  receiveTotal(total: number) {
    this.grandTotal = total;
    this.cartCount++;
  }

  selectCategory(id: number) {
    this.selectedCatId = id;
  }
}