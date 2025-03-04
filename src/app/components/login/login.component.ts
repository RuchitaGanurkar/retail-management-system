import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [RouterLink, MatInputModule, MatIcon, 
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule, MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatLabel, MatError],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }

  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = '/dashboard';

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value
      ).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.snackBar.open('Invalid username or password', 'Close', {
              duration: 3000
            });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.snackBar.open('Login failed', 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }
}