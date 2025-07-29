import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import {CartItem, OrderDetails } from '../../service/beers-company';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CartService } from './service/beerscart.service';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-beerscart',
  imports: [MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './beerscart.html',
  styleUrl: './beerscart.scss'
})
export class Beerscart implements OnInit {

  cart: CartItem[] = [];
  @Output() removeFromCart = new EventEmitter<{ guid: string, pack: string }>();
  @Output() close = new EventEmitter<void>();
  @Output() placeOrder = new EventEmitter<OrderDetails>();
  @Output() clearCart = new EventEmitter<void>();

  contactName = '';
  contactEmail = '';
  contactAddress = '';
  contactPhone = '';

  showCheckout = false;
  showConfirmation = false;
  orderDetails: OrderDetails | null = null;

  constructor(
    private cartService: CartService,
    public dialog: MatDialogRef<Beerscart>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

   ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  get totalBottles(): number {
    return this.cart.reduce((sum, item) => {
    const bottlesPerPack = item.pack ?  parseInt(item.pack.split(' ')[0], 10) : 1;
    return sum + bottlesPerPack * (item.cant || 1);
    }, 0);
  }

  get subTotal(): number {
    return this.cart.reduce((sum, item) => {
    const bottlesPerPack = item.pack ?  parseInt(item.pack.split(' ')[0], 10) : 1;
    return sum + bottlesPerPack * (item.cant || 1) * item.price;
    }, 0);
  }

 get discount(): number {
    const totalBottles = this.totalBottles;
    let discount = 0;
    if(totalBottles >= 8 && totalBottles < 10) discount = 100;
    if (totalBottles >= 10 && totalBottles < 14) discount = 200;
    if (totalBottles >= 14) discount = 300;

    return this.cart.reduce((totalDiscount, item) => totalDiscount + discount * item.quantity, 0);
  }

  get total(): number {
    return this.subTotal - (this.discount || 0);
  }

  handleCheckout() {
    this.showCheckout = true;
  }

  handlePlaceOrder() {
    this.orderDetails = {
      items: this.cart,
      contact: {
        name: this.contactName,
        email: this.contactEmail,
        address: this.contactAddress,
        phone: this.contactPhone,
      }
    };
    this.showConfirmation = true;
    this.placeOrder.emit(this.orderDetails);
  }

  handleClearCart() {
    this.clearCart.emit();
    this.showConfirmation = false;
    this.showCheckout = false;
  }
  
  handleClose() {
  this.dialog.close();
  }

}
