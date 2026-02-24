import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { MasterProducts } from './components/master-products/master-products';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Home, Footer ,Header , MasterProducts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-course');
}
