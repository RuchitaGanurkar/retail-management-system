import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterModule,
    RouterOutlet,
    MatIconModule, 
    MatSidenavModule, 
    MatToolbarModule, 
    MatListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isManager = false;
  isSupplier = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('Current user in dashboard:', this.currentUser);
    this.isManager = this.authService.hasRole(['manager']);
    this.isSupplier = this.authService.hasRole(['supplier']);
    
    console.log('Is manager:', this.isManager);
    console.log('Is supplier:', this.isSupplier);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}