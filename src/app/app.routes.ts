import { Routes } from '@angular/router';
import { Beers } from './pages/beers/beers';
import { BeersAboutUs} from './pages/beers-about-us/beers-about-us';
import { Home } from './pages/home/home';


export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'beers', component: Beers },
  { path: 'beers-about-us', component: BeersAboutUs },
  { path: '', redirectTo: 'beers', pathMatch: 'full' },
  { path: '**', redirectTo: 'beers' } 
];
