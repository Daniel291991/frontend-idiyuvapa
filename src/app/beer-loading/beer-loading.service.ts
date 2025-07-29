import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BeerLoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    console.log(true);
    setTimeout(() => this.loadingSubject.next(true)); 
  }
  hide() { 
    console.log(false);
    setTimeout(() => this.loadingSubject.next(false)); 
  }
}