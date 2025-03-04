import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../models/supplier.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, RouterModule ,MatPaginatorModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'contactPerson', 'email', 'phone', 'actions'];
  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      console.log('Loaded suppliers:', data);
      this.suppliers = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.suppliers = this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(filterValue) ||
      supplier.contactPerson.toLowerCase().includes(filterValue) ||
      supplier.email.toLowerCase().includes(filterValue) ||
      supplier.phone.includes(filterValue)
    );
  }

  viewSupplier(id: number): void {
    console.log('View Supplier:', id);

    this.router.navigate(['/suppliers', id, 'view']);
  }

  editSupplier(id: number): void {
    console.log('Edit Supplier:', id);

    this.router.navigate(['/suppliers', id, 'edit']);
  }
}
