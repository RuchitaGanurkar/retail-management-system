import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Sale } from '../models/sale.model';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'api/sales';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(
      catchError(this.handleError<Sale[]>('getSales', []))
    );
  }

  // Filter sales by date range
  getSalesByDateRange(startDate: string, endDate: string): Observable<Sale[]> {
    return this.getSales().pipe(
      map(sales => sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      })),
      catchError(this.handleError<Sale[]>('getSalesByDateRange', []))
    );
  }
  

  // Generate Excel report
  generateExcelReport(sales: Sale[], reportType: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sales);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    
    const fileName = `sales_${reportType}_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
