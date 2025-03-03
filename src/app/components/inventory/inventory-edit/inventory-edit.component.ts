import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-edit',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatOption],
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent implements OnInit {
  productForm!: FormGroup;
  product!: Product;
  suppliers: Supplier[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.getProduct();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [''],
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

  getProduct(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.inventoryService.getProduct(id)
      .subscribe(product => {
        this.product = product;
        this.productForm.patchValue(product);
      });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.productForm.value
      };

      this.inventoryService.updateProduct(updatedProduct)
        .subscribe({
          next: () => {
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/inventory']);
          },
          error: () => {
            this.snackBar.open('Error updating product', 'Close', {
              duration: 3000
            });
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}