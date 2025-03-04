import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-inventory-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent implements OnInit {
  productForm!: FormGroup;
  suppliers: Supplier[] = [];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      supplierId: ['', Validators.required],
      stockLevel: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers()
      .subscribe(suppliers => {
        this.suppliers = suppliers;
      });
  }

  onSubmit(): void {
    console.log('Submit button clicked!'); 

    if (this.productForm.valid) {
      const newProduct: Product = {
        ...this.productForm.value,
        id: 0 // The in-memory API assigns a new ID
      };
  

    console.log('New Product Data:', newProduct); 

      this.inventoryService.createProduct(newProduct).subscribe({
        next: (product) => {
          console.log('New Product Added:', product);

          this.snackBar.open('Product created successfully', 'Close', {
            duration: 300
          });
  
          
          // after adding the product
          this.inventoryService.getProducts().subscribe((updatedProducts) => {
            console.log('Updated Inventory:', updatedProducts);
            this.router.navigate(['/inventory']);
          });
        },
        error: (error) => {


        console.error('Error creating product:', error);


          this.snackBar.open('Error creating product', 'Close', {
            duration: 300
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
