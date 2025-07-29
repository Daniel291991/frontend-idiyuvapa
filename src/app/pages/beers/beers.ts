import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../modal-beers/beerscart/service/beerscart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Beer, BeersCompanyService, CartItem, OrderDetails } from '../../service/beers-company';
import { BeerLoadingService } from '../../beer-loading/beer-loading.service';
import { v4 as uuidv4 } from 'uuid';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-beers',
  imports: [ MatCardModule, MatButtonModule, NgStyle],
  templateUrl: './beers.html',
  styleUrl: './beers.scss'
})
export class Beers {
  beers: Beer[] = [];
  selectedBeer: Beer | null = null;
  cart: CartItem[] = [];
  showConfirmation = false;
  isLoading = true;
  showCartModal = false;
  orderDetails: OrderDetails | null = null;
  @Output() openCart = new EventEmitter<void>();
  
  constructor(
    private cartService: CartService, 
    private beersCompanyService: BeersCompanyService,
    private beerLoadingService: BeerLoadingService,
  ) {}

  async ngOnInit() {
    this.beerLoadingService.show();
    (await this.beersCompanyService.fetchBeers()).subscribe({
      next: (beers) => {
        this.beers = beers;
        this.beerLoadingService.hide();
      },
      error: () => {
        this.beers = [];
        this.beerLoadingService.hide();
      }
    });
  }

  updateCart(cart: CartItem[]) {
    this.cart = cart;
    this.cartService.addToCart(cart[0]);
  }

  handleSelectBeer(beer: Beer) {
    this.selectedBeer = beer;
  }

  handleSelectPack(pack: string, Beer: Beer) {
    this.handleAddToCart(Beer, pack);
    this.openCart.emit(); 
  }

  handleAddToCart(beer: Beer, pack: string) {
    if (!this.selectedBeer) return;
    debugger;
    const quantity = parseInt(pack.split(' ')[0], 10);
    const existing = this.cart.find(item => item.id === beer.id && item.pack === pack);

    let updatedCart = [...this.cart];
    if (existing) {
       existing.cant = (existing.cant || existing.quantity || 1) + 1; // suma 1 pack
    } else {
      updatedCart.push({
        id: this.selectedBeer.id,
        name: this.selectedBeer.name,
        quantity,
        cant: 1,
        color: this.selectedBeer.color,
        pack,
        image: this.selectedBeer.image,
        price: this.selectedBeer.price
      });
    }

    this.updateCart(updatedCart);
    this.selectedBeer = null;
  }

  handleCloseModal() {
    this.selectedBeer = null;
  }
}
