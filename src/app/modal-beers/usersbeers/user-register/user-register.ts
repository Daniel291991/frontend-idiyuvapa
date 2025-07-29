import { Component } from '@angular/core';
import { FormControl, FormsModule, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { BeersCompanyService, Contact, UsersBeer } from '../../../service/beers-company';
import { BeerLoadingService } from '../../../beer-loading/beer-loading.service';
import { ErrorBeer } from '../../../error-beer/error-beer';
import { User } from '../user/user';
import * as CryptoJS from 'crypto-js';

const saltRounds = 10;

@Component({
  selector: 'app-user-register',
  imports: [MatFormFieldModule, 
    MatDialogModule, 
    FormsModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,],
  templateUrl: './user-register.html',
  styleUrl: './user-register.scss'
})
export class UserRegister {
  _cargo : string = '';
  userBeer: UsersBeer | any
  contacto: Contact | any
  rut: any;
  nombre: any;
  apellido: any;
  email: any;
  telefono: any;
  direccion: any;
  _session = false;
  _detailUser = false;
  Pass: any;
  Pass2: any;
  passwordsNoCoinciden = false;
  selectedTabIndex = 0;
  rutValido = true;
  UserBeerExiste = false;
  InputControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  constructor(private dialogRef: MatDialogRef<UserRegister>,
              private beercompany: BeersCompanyService,
              private beerLoadingService: BeerLoadingService,
              private dialog: MatDialog
  ){}

  async ngOnInit(){
    this.selectedTabIndex = 0;
  }

  irAlSiguienteTab(form: NgForm) {
    this.selectedTabIndex = 1;
    setTimeout(() => {
      const firstInput = document.querySelector('.user-details-form input');
      if (firstInput) (firstInput as HTMLElement).focus();
      });
  }

  close() {
    this.dialogRef.close();
  }

  async RegistrarUserBeer(form: NgForm)
  {
    const hash = CryptoJS.SHA256(this.Pass2).toString();
    this.beerLoadingService.show();
    const userData = {
      rut: this.rut,
      cargo:'Cliente',
      contacts: [{
        nombre: this.nombre,
        apellidos: this.apellido,
        correo: this.email,
        celular: this.telefono,
        direccion: this.direccion,
      }],
      session: {
        email: this.email,
        pass: hash
      }
    };
    try 
    {
      if (form.valid) {
        const respUser = await this.beercompany.getUserIdByRut(this.rut);
        const respCont = await this.beercompany.getContactByEmail(this.email);
        let userId = respUser;
        this.contacto = respCont;
        
        if(!userId) {
          this.userBeer = await this.beercompany.RegisterUserBeer(JSON.stringify(userData));
          localStorage.setItem('logged', 'true');
          localStorage.setItem('cargo', this.userBeer.cargo);
          localStorage.setItem('beerUser', JSON.stringify(this.userBeer));
          this.dialog.open(User, {
            position: { right: '0', top: '0' },
            width: '400px',
            panelClass: 'cart-modal-panel',
            backdropClass: 'cart-modal-backdrop'
          });
          //window.location.reload();
        }
        
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorMsg = (error && typeof error === 'object' && 'mess' in error) ? (error as any).mess : 'Error desconocido';
      this.mostrarErrorBeer(errorMsg);
    }
    finally
    {
      this.beerLoadingService.hide();
    }

  }

  async ValidatePasswordEqual() {
    this.passwordsNoCoinciden = this.Pass !== this.Pass2;
  }

  mostrarErrorBeer(err:string) {
    this.dialog.open(ErrorBeer, {
          width: '400px',
          data: { message: err }
      });
  }

  FormatedRut(rut: string){
    rut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    // Si el rut es muy corto, retorna tal cual
    if (rut.length < 2) {
      this.rut = rut;
      this.rutValido = false;
      return rut;
    }

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    this.rut = `${cuerpo}-${dv}`;
    return this.rut;
  }

  validarRut(rut: string): boolean {
    // Separar cuerpo y dígito verificador
    const rutParts = rut.split('-');
   if (rutParts.length !== 2) return false;
    
    const cuerpo = rutParts[0];
    let dv = rutParts[1].toUpperCase();
    // Validar largo mínimo
    if (cuerpo.length < 7) {
      this.mostrarErrorBeer('Rut demaciado corto');
      return false;
    }

    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const dvEsperado = 11 - (suma % 11);
    let dvCalc = '';
    if (dvEsperado === 11) dvCalc = '0';
    else if (dvEsperado === 10) dvCalc = 'K';
    else dvCalc = dvEsperado.toString();
    this.rutValido = dv === dvCalc;
    if(!this.rutValido) {
      this.mostrarErrorBeer('Ingrese un Rut Valido');
      this.rut = '';
    }
    return this.rutValido;
  }
}
