import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-beer',
  imports: [MatSnackBarModule
  ],
  templateUrl: './error-beer.html',
  styleUrl: './error-beer.scss'
})
export class ErrorBeer {
  mensaje: string;
  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<ErrorBeer>,
              @Inject(MAT_DIALOG_DATA) public data: any,) 
              {
                this.mensaje = data.message || {};
              } 
  recargar() {
    window.location.reload();
  }
  
  cerrar() {
    this.dialogRef.close();
  }
}
