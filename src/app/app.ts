import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { MasterProducts } from './components/master-products/master-products';
import { Products } from './components/products/products';

@Component({
  selector: 'app-root',
  imports: [Home, Footer ,Header , MasterProducts,Products],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-course');
}
