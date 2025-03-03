
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-supplier-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.css']
})
export class SupplierViewComponent implements OnInit {
  supplierForm: FormGroup;
  supplier: Supplier | null = null;
  isEditing = false;
  isEditable = false;
  canEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.supplierForm = this.createForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplier(+id);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  loadSupplier(id: number) {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        if (this.supplier) {
          this.populateForm(this.supplier);
          this.checkEditPermissions();
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading supplier details', 'Close', {
          duration: 3000
        });
      }
    });
  }

  populateForm(supplier: Supplier) {
    this.supplierForm.patchValue({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
  }

  checkEditPermissions() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.canEdit = currentUser.role === 'manager' || 
                     (currentUser.role === 'supplier' && 
                      currentUser.supplierId === this.supplier?.id);
    }
  }

  toggleEdit() {
    this.isEditing = true;
    this.isEditable = true;
  }

  cancelEdit() {
    if (this.supplier) {
      this.populateForm(this.supplier);
    }
    this.isEditing = false;
    this.isEditable = false;
  }

  saveChanges() {
    if (this.supplierForm.valid && this.supplier) {
      const updatedSupplier: Supplier = {
        ...this.supplier,
        ...this.supplierForm.value
      };

      this.supplierService.updateSupplier(updatedSupplier).subscribe({
        next: () => {
          this.snackBar.open('Supplier updated successfully', 'Close', {
            duration: 3000
          });
          this.isEditing = false;
          this.isEditable = false;
          this.supplier = updatedSupplier;
        },
        error: (error) => {
          this.snackBar.open('Error updating supplier', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}