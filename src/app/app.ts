import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { CartItem } from './service/beers-company';
import { BeerLoadingService } from './beer-loading/beer-loading.service';
import { BeerLoading } from './beer-loading/beer-loading';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, BeerLoading, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'beers-idiyu-vapa';
  cart: CartItem[] = [];
  
  constructor(
    public beerLoadingService: BeerLoadingService) {
      this.beerLoadingService.loading$.subscribe();
    }
}
