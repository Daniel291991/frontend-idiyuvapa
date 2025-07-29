import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, concat} from 'rxjs';
import { delay } from 'rxjs/operators';
import  axios  from 'axios'; 
import { environment } from '../../Enviroments/enviroment';


const Uri = environment.apiUrl;

export interface Beer {
  id: string;
  name: string;
  description: string;
  stock: string;
  quality: string;
  color: string;
  image: string;
  price: number;
  packImages: { [key: string]: string };
  packOptions: string[];
}

export interface OrderDetails {
        items: CartItem[];
        contact: {
            name: string;
            email: string;
            address: string;
            phone: string;
        };
}

export interface Order{
  price: string;
  discount: string;
  subTotal: string;
  status: string;
  ccreatedOn: string;
  items: CartItem[];
  contact: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
}

export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    color: string;
    pack: string; // Nuevo campo para el tipo de pack
    image: string;
    price: number; // Precio por botella
    cant: number;
}

export interface Cart {
  beerId: string;
  name: string;
  quantity: number;
  pack: string;
  price: number;
  discount: number;
  subTotal: number;
}

export interface UsersBeersResponse {
  usuarios: UsersBeer[];
}

export interface UsersBeer {
  _id: string;
  rut: string;
  cargo: string;
  createdOn: string;
  modifiedOn: string;
  contacts: Contact[];
  session: Session;
  pedido: Pedido[];
}

export interface Contact {
  _id:string;
  nombre: string;
  apellidos: string;
  celular: string;
  correo: string;
  direccion: string;
  createdOn: string;
  modifiedOn: string;
  userBeerId: string;
}

export interface Session {
  email: string;
  pass: string;
  modifiedOn: string;
  _id:string;
}

export interface DetailsBeersPack {
  beer: string;
  cant: number;
  pack: string;
  total: number;
  desct: number;
  subTotal: number;
  _id: string;
}

export interface Pedido {
  _id:string;
  createdOn: string;
  total: number;
  desct: number;
  subTotal: number;
  detailsBeersPack: DetailsBeersPack[];
}

@Injectable({
  providedIn: 'root'
})

export class BeersCompanyService {
  private beersOrderSubject = new BehaviorSubject<any>(null);
  beersOrder$ = this.beersOrderSubject.asObservable();
  constructor() { }

  async fetchBeers(): Promise<Observable<Beer[]>> {
    const response = await axios.get(`${Uri}/api/fetchBeers`,{
       headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
    const beers = response.data;
    return of(beers).pipe(delay(2000));
  }

  async sendOrder(order: OrderDetails): Promise<Observable<{ success: boolean; message: string; }>> {
    console.log('Pedido recibido:', order);
    return of({ success: true, message: 'Pedido recibido correctamente.' }).pipe(delay(1000));
  }

  async fetchUserLoginBeer(_email:string, _password: string): Promise<any>{
    let user: any;
    try{
          if (!_email || !_password) {
            throw new Error('Email y contraseña son requeridos.');
          }
          const usersResponse = await axios.get(`${Uri}/api/UsersBeer/${_email}/${_password}`,{
             headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          });
          user = usersResponse.data;
          if (!user) {
            throw new Error('Usuario o contraseña incorrectos.');
          }
          user = usersResponse.data;
    }
    catch(e)
    {
      throw new Error(`error: ${(e as Error)?.message}`)
    }
    return user;
  }

  async getUserIdByRut(rut:string): Promise<any> {
   
   try
   { 
      const resp = await axios.get(`${Uri}/api/UsersBeer/GetUsersByRut/${rut}`,{
             headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          });
      if (!resp || !resp.data) {
        return '';
       }
      return resp.data as string;
    }
    catch(e)
    {
      throw new Error(`error: ${(e as Error)?.message}`)
    }
  }

  async getContactByEmail(email:string): Promise<Contact> {
    try{
      const resp = await axios.get(`${Uri}/api/UsersBeer/GetContactByEmail/${email}`, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
      if (!resp || !resp.data) {
        return {
          _id: '',
          nombre: '',
          apellidos: '',
          celular: '',
          correo: '',
          direccion: '',
          createdOn: '',
          modifiedOn: '',
          userBeerId: '',
        } as Contact;
       }
      return resp.data as Contact;
      }
    catch(e)
    {
      return {
          _id:'',
          nombre: '',
          apellidos: '',
          celular: '',
          correo: '',
          direccion: '',
          createdOn: '',
          modifiedOn: '',
          userBeerId: '',
      } as Contact
    }
  }

  async getUserByContactEmail(id:string, email:string):Promise<UsersBeer> {
    try
    { 
      const resp = await axios.get(`${Uri}/api/UsersBeer/GetUserByContactEmail/${id}/${email}`, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
      return resp.data as UsersBeer
      }
    catch(e)
    {
      return {
        _id: '',
        rut: '',
        cargo: '',
        createdOn: '',
        modifiedOn: '',
        contacts: [],
        session: {
          email: '',
          pass: '',
          modifiedOn: '',
          _id: ''
        },
        pedido: []
      } as unknown as UsersBeer;
    }
  }

  async RegisterUserBeer(jsonUserBeer: string): Promise<UsersBeer> {
    try{
      const response = await axios.post(`${Uri}/api/UsersBeer/CreateUserBeer`, jsonUserBeer, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
        return response.data as UsersBeer;
      }
    catch(e)
    {
      return {
        _id: '',
        rut: '',
        cargo: '',
        createdOn: '',
        modifiedOn: '',
        contacts: [],
        session: {
          email: '',
          pass: '',
          modifiedOn: '',
          _id: ''
        },
        pedido: []
      } as unknown as UsersBeer;
    }
  }
  
  async setBeersOrder(order: any) {
    this.beersOrderSubject.next(order);
  }
}