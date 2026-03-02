import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { NotFound } from './components/not-found/not-found';
import { Contact } from './components/contact/contact';
import { Details } from './components/details/details';
import { Products } from './components/products/products';
import { MasterProducts } from './components/master-products/master-products';
import { ViewCart } from './components/view-cart/view-cart';


export const routes: Routes = [
    {path:'', component:MasterProducts},
    {path:'About' , component:AboutUs},
    {path:'Contact' , component : Contact},
    {path:'Details/:id' ,component:Details},
    {path:'Products' , component:Products},
    {path:'Master' ,  component:MasterProducts},
    {path:'cart', component: ViewCart }
];
