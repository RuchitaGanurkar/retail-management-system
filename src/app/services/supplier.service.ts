import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'api/suppliers';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      tap(_ => console.log('Fetched suppliers')),
      catchError(this.handleError<Supplier[]>('getSuppliers', []))
    );
  }

  getSupplier(id: number): Observable<Supplier> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Supplier>(url).pipe(
      tap(_ => console.log(`Fetched supplier id=${id}`)),
      catchError(this.handleError<Supplier>(`getSupplier id=${id}`))
    );
  }

  updateSupplier(supplier: Supplier): Observable<any> {
    return this.http.put(this.apiUrl, supplier, this.httpOptions).pipe(
      tap(_ => console.log(`Updated supplier id=${supplier.id}`)),
      catchError(this.handleError<any>('updateSupplier'))
    );
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier, this.httpOptions).pipe(
      tap((newSupplier: Supplier) => console.log(`Added supplier w/ id=${newSupplier.id}`)),
      catchError(this.handleError<Supplier>('createSupplier'))
    );
  }

  deleteSupplier(id: number): Observable<Supplier> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Supplier>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted supplier id=${id}`)),
      catchError(this.handleError<Supplier>('deleteSupplier'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Error details:', error);
      return of(result as T);
    };
  }
}