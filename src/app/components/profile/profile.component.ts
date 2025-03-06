import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIcon, FormsModule, CommonModule, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle, MatCard],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

  export class ProfileComponent implements OnInit {
    currentUser: User | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      this.currentUser = this.authService.currentUserValue;
    }
  }
