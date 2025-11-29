import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Trip } from '../models/trip';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrls: ['./trip-card.css']
})
export class TripCard {

  // Trip object passed in from the parent list component
  @Input('trip') trip!: Trip;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  /* 
   * Navigates to the edit-trip page.
   * Stores the trip code in localStorage so the edit component
   * can load the correct trip from the API.
   *
   * Enhancement 2:
   * The edit button is now protected by RBAC in the template (trip-card.html).
   * Only admin users can reach this function.
   */
  editTrip(trip: Trip) {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }

  // Returns true if the user has a valid JWT token
  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  /*
   * Enhancement 2:
   * Checks if the current user is an admin.
   * This is used to hide/show edit features in the trip card template.
   */
  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

}
