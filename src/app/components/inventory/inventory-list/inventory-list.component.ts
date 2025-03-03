// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Router, ActivatedRoute, RouterLink } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { Product } from '../../../models/product.model';
// import { Supplier } from '../../../models/supplier.model';
// import { InventoryService } from '../../../services/inventory.service';
// import { SupplierService } from '../../../services/supplier.service';
// import { MatIconModule } from '@angular/material/icon';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-inventory-list',
//   standalone: true,
//   imports: [MatTableModule, MatIconModule, FormsModule, MatLabel, MatFormField, ReactiveFormsModule, RouterLink, MatPaginator, CommonModule],
//   templateUrl: './inventory-list.component.html',
//   styleUrls: ['./inventory-list.component.css']
// })
// export class InventoryListComponent implements OnInit {
//   displayedColumns: string[] = ['id', 'name', 'category', 'supplierId', 'stockLevel', 'price', 'actions'];
//   dataSource!: MatTableDataSource<Product>;
//   suppliers: Supplier[] = [];
//   supplierMap = new Map<number, string>();

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(
//     private inventoryService: InventoryService,
//     private supplierService: SupplierService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private snackBar: MatSnackBar,
//     private dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.loadSuppliers();
//     this.loadProducts();

//     // Check if we're on the delete route
//     this.route.params.subscribe(params => {
//       if (params['id'] && this.router.url.includes('/delete')) {
//         this.confirmDelete(+params['id']);
//       }
//     });
//   }

  
//   loadProducts(): void {
//     this.inventoryService.getProducts().subscribe((products) => {
//       this.dataSource.data = products;
//     });
//   }
  

//   loadSuppliers(): void {
//     this.supplierService.getSuppliers()
//       .subscribe(suppliers => {
//         this.suppliers = suppliers;
//         // Create a map for quick supplier name lookup
//         suppliers.forEach(supplier => {
//           this.supplierMap.set(supplier.id, supplier.name);
//         });
//       });
//   }


//   getSupplierName(supplierId: number): string {
//     return this.supplierMap.get(supplierId) || 'Unknown Supplier';
//   }

//   viewSupplier(supplierId: number): void {
//     this.router.navigate(['/supplier/view', supplierId]);
//   }

//   editProduct(id: number): void {
//     this.router.navigate(['/inventory/edit', id]);
//   }

//   confirmDelete(id: number): void {
//     const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
//       width: '300px',
//       data: { id }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.deleteProduct(id);
//       } else {
//         this.router.navigate(['/inventory']);
//       }
//     });
//   }

//   deleteProduct(id: number): void {
//     this.inventoryService.deleteProduct(id)
//       .subscribe({
//         next: () => {
//           this.snackBar.open('Product deleted successfully', 'Close', {
//             duration: 3000
//           });
//           this.loadProducts();
//           this.router.navigate(['/inventory']);
//         },
//         error: () => {
//           this.snackBar.open('Error deleting product', 'Close', {
//             duration: 3000
//           });
//           this.router.navigate(['/inventory']);
//         }
//       });
//   }

//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }
// }

// // Delete Confirmation Dialog Component

// @Component({
//   selector: 'delete-confirmation-dialog',
//   imports: [MatDialogModule, MatButtonModule],
//   template: `
//     <h2 mat-dialog-title>Confirm Delete</h2>
//     <mat-dialog-content>
//       Are you sure you want to delete this product? This action cannot be undone.
//     </mat-dialog-content>
//     <mat-dialog-actions>
//       <button mat-button [mat-dialog-close]="false">Cancel</button>
//       <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
//     </mat-dialog-actions>
//   `
// })
// export class DeleteConfirmationDialog {
//   constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialog>) {}
// }


import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatIconModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'category', 'supplierId', 'stockLevel', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  suppliers: Supplier[] = [];
  supplierMap = new Map<number, string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();

    // Check if we're on the delete route
    this.route.params.subscribe(params => {
      if (params['id'] && this.router.url.includes('/delete')) {
        this.confirmDelete(+params['id']);
      }
    });
  }

  ngAfterViewInit() {
    // Connect the dataSource with the paginator and sort
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadProducts(): void {
    this.inventoryService.getProducts().subscribe((products) => {
      this.dataSource.data = products;
      console.log('Products loaded:', products);
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers()
      .subscribe(suppliers => {
        this.suppliers = suppliers;
        // Create a map for quick supplier name lookup
        suppliers.forEach(supplier => {
          this.supplierMap.set(supplier.id, supplier.name);
        });
        console.log('Suppliers loaded:', suppliers);
      });
  }

  getSupplierName(supplierId: number): string {
    return this.supplierMap.get(supplierId) || 'Unknown Supplier';
  }

  viewSupplier(supplierId: number): void {
    this.router.navigate(['/supplier/view', supplierId]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/inventory/edit', id]);
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(id);
      } else {
        this.router.navigate(['/inventory']);
      }
    });
  }

  deleteProduct(id: number): void {
    this.inventoryService.deleteProduct(id)
      .subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadProducts();
          this.router.navigate(['/inventory']);
        },
        error: () => {
          this.snackBar.open('Error deleting product', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/inventory']);
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

@Component({
  selector: 'delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      Are you sure you want to delete this product? This action cannot be undone.
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialog>) {}
}