import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Sale } from '../../../models/sale.model';
import { SalesService } from '../../../services/sales.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'date', 'productName', 'quantity', 'unitPrice', 'totalPrice'];
  dataSource = new MatTableDataSource<Sale>([]);
  filterForm!: FormGroup;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private salesService: SalesService,
    private fb: FormBuilder
  ) {
    console.log('SalesListComponent constructor called');
  }

  ngOnInit(): void {
    console.log('SalesListComponent ngOnInit called');
    this.initFilterForm();
    this.loadSales();
  }

  ngAfterViewInit() {
    // This ensures paginator and sort are connected after view initialization
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Paginator and sort initialized');
    }
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    console.log('Filter form initialized');
  }
  
  loadSales(): void {
    console.log('Loading sales data...');
    this.salesService.getSales().subscribe({
      next: (sales) => {
        console.log('Sales data received:', sales);
        this.dataSource.data = sales;
        
        // Make sure to connect paginator and sort if they're available
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
      }
    });
  }
}