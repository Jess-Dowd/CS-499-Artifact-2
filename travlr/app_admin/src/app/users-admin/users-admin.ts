import { Component, OnInit } from '@angular/core';
import { TripDataService } from '../services/trip-data';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-admin.html',
  styleUrl: './users-admin.css'
})
export class UsersAdminComponent implements OnInit {

  // List of all users returned from the backend
  users: User[] = [];

  // State flags for UI feedback
  loading = false;
  error = '';

  constructor(
    private tripDataService: TripDataService,
    public auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Enhancement 3:
    // This component is only for admin accounts.
    if (!this.auth.isAdmin()) {
      this.error = 'You must be an admin to view this page.';
      return;
    }

    // Load user list from backend
    this.loading = true;
    this.tripDataService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  // Called when admin selects a new role in the dropdown
  // Enhancement 3: Sends PUT /api/users/:id to update user data.
  onRoleChange(u: User, newRole: any): void {
    this.tripDataService.updateUser(u._id as string, { role: newRole }).subscribe({
      next: (updated) => {
        u.role = updated.role; // Update UI after successful save
      },
      error: () => {
        this.error = 'Failed to update user.';
      }
    });
  }
}

