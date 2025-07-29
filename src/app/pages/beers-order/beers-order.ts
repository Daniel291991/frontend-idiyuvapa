import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BeersCompanyService } from '../../service/beers-company';
import { BeerLoadingService } from '../../beer-loading/beer-loading.service';

@Component({
  selector: 'app-beers-order',
  imports: [MatDialogModule],
  templateUrl: './beers-order.html',
  styleUrl: './beers-order.scss'
})
export class BeersOrder {
    constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<BeersOrder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public BeersCompany: BeersCompanyService,
    private beerLoadingService: BeerLoadingService
  ) {
    
  }

  async ngOnInit() {
    this.beerLoadingService.show();
  }
}
