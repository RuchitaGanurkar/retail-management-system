import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ MatInputModule,MatFormField, MatLabel , FormsModule, MatCardActions, MatIcon, FormsModule, CommonModule, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle, MatCard],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

  export class ProfileComponent implements OnInit {
    currentUser: User | null = null;
    isEditing = false;
    editableUser: User = {} as User;

    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      this.loadUserProfile();
    }
  
    loadUserProfile(): void {
      this.currentUser = this.authService.currentUserValue;
    }
  
    editProfile(): void {
      if (this.currentUser) {
        this.editableUser = { ...this.currentUser }; // Clone the user data
        this.isEditing = true;
      }
    }
  
    saveProfile(): void {
      if (this.editableUser) {
        localStorage.setItem('current_user', JSON.stringify(this.editableUser));
        this.authService.updateCurrentUser(this.editableUser);
        this.currentUser = this.editableUser;
        this.isEditing = false;
      }
    }
  
    cancelEdit(): void {
      this.isEditing = false;
  }

}