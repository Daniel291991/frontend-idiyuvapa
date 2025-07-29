import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { Beerscart } from '../modal-beers/beerscart/beerscart';
import { CartService } from '../modal-beers/beerscart/service/beerscart.service';
import { Login } from '../modal-beers/usersbeers/login/login';
import { BeersAboutUs } from '../pages/beers-about-us/beers-about-us';
import { Beers } from '../pages/beers/beers';
import { Home } from '../pages/home/home';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../modal-beers/usersbeers/user/user';
import { BeersCompanyService } from '../service/beers-company';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, 
    MatButtonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})

export class Navbar {
  _userlogged = localStorage.getItem('logged') === 'true';
  _cargo = localStorage.getItem('cargo') ?? '';
  cart: any[] = [];
  @Input() cartCount: number = 0;
  @Output() cartClick = new EventEmitter<void>();
  _beersOrder = localStorage.getItem('_beersOrder') === 'true';
  _beerUser: any;
   constructor(
    private dialog: MatDialog,
    private cartService: CartService,
    private beerCompany: BeersCompanyService,
    private router: Router,) {
    this.beerCompany.beersOrder$.subscribe(x => {
      this._beersOrder = x
    });
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.cartCount = cart.length;
    });
  }
  ngOnInit() {
    this._userlogged = localStorage.getItem('logged') === 'true';
    this._cargo = localStorage.getItem('cargo') ?? '';
    this._beerUser = (() => {
      const beerUserStr = localStorage.getItem('beerUser');
      return beerUserStr ? JSON.parse(beerUserStr) : null;
    })();
    this._beersOrder = localStorage.getItem('_beersOrder') === 'true';
  }

  OpenPage(pageBeer: string) {
    this._userlogged = localStorage.getItem('logged') === 'true';
    this._cargo = localStorage.getItem('cargo') ?? '';
    switch(pageBeer)
    {
      case 'go-about-us':
        this.router.navigate(['/beers-about-us']);
        break;
      case 'go-beers':
        this.router.navigate(['/beers']);
        break;
      case 'go-beercart':
        if(!this._beersOrder) {
          this.dialog.open(Beerscart, {
            width: '400px',
            data: { cart: this.cart }
          });
        }
        break;
      case 'go-home':
        this.router.navigate(['/home']);
        break;
      case 'go-users':
        switch(this._cargo){
            case 'Administrador':
               this.dialog.open(Login, {
                    position: { right: '0', top: '0' },
                    width: '400px',
                    panelClass: 'cart-modal-panel',
                    backdropClass: 'cart-modal-backdrop'
                  });
            break;
            default:
              if(this._userlogged){
                this.dialog.open(User);
              }
              else {
                  this.dialog.open(Login);
                
              }
            break;
          }
        break;
      case 'go-beersOrder':
      
      break;
    }
  }
}
