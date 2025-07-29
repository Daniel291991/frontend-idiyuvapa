import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { UsersBeer } from '../../../service/beers-company';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [MatDialogModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    FormsModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User {
  _beerUser: UsersBeer | any;
  _columnDisable= false;
  constructor(private dialog: MatDialog,
  private dialogRef: MatDialogRef<User>
  ){}

async ngOnInit(){
  this._columnDisable = false;
  const beerUserStr = localStorage.getItem("beerUser");
  this._beerUser = beerUserStr ? JSON.parse(beerUserStr) as UsersBeer : undefined;
  
}

Update(){

}

CerrarSession(){
  this.dialogRef.close();
  localStorage.clear();
  window.location.reload();
}

close() {
    this.dialogRef.close();
  }
}
