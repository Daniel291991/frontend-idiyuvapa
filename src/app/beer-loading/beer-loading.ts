import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-beer-loading',
  imports: [CommonModule,MatProgressSpinnerModule, MatCardModule],
  templateUrl: './beer-loading.html',
  styleUrl: './beer-loading.scss'
})
export class BeerLoading {
  @Input() show: boolean = false;
}
