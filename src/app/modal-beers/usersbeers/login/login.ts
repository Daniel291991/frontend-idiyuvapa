import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BeersCompanyService } from '../../../service/beers-company';
import { BeerLoadingService } from '../../../beer-loading/beer-loading.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../user/user';
import { UserRegister } from '../user-register/user-register';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  imports: [MatDialogModule, 
    MatFormFieldModule,
    FormsModule,
    MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  _cargo : string = '';
  _email: string = '';
  _password: string = '';
  passwordHash:string = '';
  _error: string = '';
  _beerUser: any;
  _userlogged: boolean = false;
  _order: boolean = false;
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<Login>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public BeersCompany: BeersCompanyService,
    private beerLoadingService: BeerLoadingService,
    private router: Router,
  ) {
    
  }

  ngOnInit(){
    this._cargo = localStorage.getItem('cargo') ?? '';
    this._userlogged = localStorage.getItem('logged') === 'true';
    this._order = localStorage.getItem('_beersOrder') === 'true';
  }

  async login() {
    this.beerLoadingService.show();
    try {
        const hash = CryptoJS.SHA256(this._password).toString();
        this.passwordHash = hash;
        this._beerUser = await this.BeersCompany.fetchUserLoginBeer(this._email, this.passwordHash);
        if(!this._beerUser) return;
        localStorage.setItem('beerUser', JSON.stringify(this._beerUser));
        const isLogged = this._beerUser ? true : false;
        if (isLogged) {
          this.dialogRef.close();
          this._cargo = this._beerUser.cargo;
          localStorage.setItem('logged', 'true');
          localStorage.setItem('cargo', this._beerUser.cargo);
          switch(this._cargo){
            case 'Administrador':
              // aquí debemos abrir una nueva page que puede adminitrar los pedidos que aun no se finiquitan
              this.BeersCompany.setBeersOrder(true);
              localStorage.setItem('_beerOrder','true');
              this.dialogRef.close();
            break;
            default:
              this.dialog.open(User, {
                position: { right: '0', top: '0' },
                width: '400px',
                panelClass: 'cart-modal-panel',
                backdropClass: 'cart-modal-backdrop'
              });
              break;
          }
        } 
        else {
          localStorage.setItem('logged', 'false');
        }
    }
    catch(e) {
      const errorMessage = (e && typeof e === 'object' && 'message' in e) ? (e as any).message : e;
      console.log(`usuarios ${errorMessage}`);
    }
    finally {
      this.beerLoadingService.hide();
    }
  }

  close() {
    this.dialogRef.close();
  }

  CerrarSession(){
    localStorage.clear();
    this.dialogRef.close();
    window.location.reload();
  }
  async register(){
    this.dialogRef.close();
    this.dialog.open(UserRegister);
  }
}
