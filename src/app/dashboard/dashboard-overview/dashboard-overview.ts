import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule, NgIf],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverview {

  showAddCategory = false;

  toggleAddCategory()
  {
    this.showAddCategory=!this.showAddCategory;
  }

}
