import { Component } from '@angular/core';
import { Products } from '../products/products';
import { ICategory } from '../../models/icategory';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-master-products',
  imports: [Products, NgClass],
  templateUrl: './master-products.html',
  styleUrl: './master-products.css',
})
export class MasterProducts {
  selectedCatId: number = 0;
  grandTotal:    number = 0;
  cartCount:     number = 0;

  catList: ICategory[] = [
    { id: 0, name: 'All Pieces'             },
    { id: 1, name: 'Dresses & Gowns'        },
    { id: 2, name: 'Handbags & Accessories' },
    { id: 3, name: 'Shoes & Heels'          },
    { id: 4, name: 'Outerwear & Coats'      },
  ];

  receiveTotal(total: number) {
    this.grandTotal = total;
    this.cartCount++;
  }

  selectCategory(id: number) {
    this.selectedCatId = id;
  }
}