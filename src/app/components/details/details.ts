import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticProducts } from '../../services/static-products';
import { IProduct } from '../../models/iproduct';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe , CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit{
  currentId:number=0;
  product:IProduct|null=null;
  
  //3aiza amsek l product id fa angular 3mla activated routes
  constructor(private _activatedRoute:ActivatedRoute , private _detailsService: StaticProducts){
  }

  ngOnInit():void{
     this.currentId=Number(this._activatedRoute.snapshot.paramMap.get('id'));
     this.product = this._detailsService.getProductById(this.currentId);
    }

 

}
