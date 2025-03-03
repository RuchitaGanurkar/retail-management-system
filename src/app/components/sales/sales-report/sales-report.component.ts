import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../models/sale.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [ MatIcon ,MatDatepickerModule, MatPaginatorModule ,MatTabsModule , MatCardModule, MatFormFieldModule ,MatNativeDateModule ,CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatDatepickerModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {
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
  
  applyFilter(): void {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    
    console.log('Applying filter with dates:', startDate, endDate);
    
    if (startDate && endDate) {
      // Format dates to string format YYYY-MM-DD
      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);
      
      console.log('Formatted dates:', formattedStartDate, formattedEndDate);
      
      this.salesService.getSalesByDateRange(formattedStartDate, formattedEndDate).subscribe({
        next: (filteredSales) => {
          console.log('Filtered sales:', filteredSales);
          this.dataSource.data = filteredSales;
        },
        error: (error) => {
          console.error('Error filtering sales:', error);
        }
      });
    } else {
      console.log('Invalid date range');
    }
  }
  
  // Helper to format date to YYYY-MM-DD
  private formatDate(date: Date): string {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    
    return `${year}-${month}-${day}`;
  }
  
  resetFilter(): void {
    this.filterForm.reset();
    this.loadSales();
    console.log('Filter reset');
  }
  
  generateExcel(reportType: string): void {
    this.salesService.generateExcelReport(this.dataSource.filteredData, reportType);
    console.log('Excel report generated');
  }

  getTotalSales(): number {
    return this.dataSource?.filteredData
      .map(sale => sale.totalPrice)
      .reduce((acc, value) => acc + value, 0) || 0;
  }

  getTotalQuantity(): number {
    return this.dataSource?.filteredData
      .map(sale => sale.quantity)
      .reduce((acc, value) => acc + value, 0) || 0;
  }
}