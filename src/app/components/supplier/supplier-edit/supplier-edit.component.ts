import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../services/auth.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardContent, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-supplier-edit',
  imports: [MatCardModule ,CommonModule, ReactiveFormsModule, FormsModule, MatFormField, MatError, MatLabel ],
  standalone: true,
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {
  supplierForm!: FormGroup;
  supplier!: Supplier;
  isManager: boolean = false;
  isOwner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private authService: AuthService,
    private location: Location,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isManager = this.authService.hasRole(['manager']);
    this.initForm();
    this.getSupplier();

    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'supplier') {
      this.isOwner = currentUser.supplierId === parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    }
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });

    // Disable name field for suppliers (only managers can change supplier names)
    if (!this.isManager) {
      this.supplierForm.get('name')?.disable();
    }
  }

  getSupplier(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.supplierService.getSupplier(id)
      .subscribe(supplier => {
        this.supplier = supplier;
        this.supplierForm.patchValue(supplier);
      });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const updatedSupplier: Supplier = {
        ...this.supplier,
        ...this.supplierForm.value,
        // Ensure name is included if disabled
        name: this.isManager ? this.supplierForm.get('name')?.value : this.supplier.name
      };

      this.supplierService.updateSupplier(updatedSupplier)
        .subscribe({
          next: () => {
            this.snackBar.open('Supplier updated successfully', 'Close', {
              duration: 3000
            });
            this.location.back();
          },
          error: () => {
            this.snackBar.open('Error updating supplier', 'Close', {
              duration: 3000
            });
          }
        });
    }
  }

  cancel(): void {
    this.location.back();
  }
}
