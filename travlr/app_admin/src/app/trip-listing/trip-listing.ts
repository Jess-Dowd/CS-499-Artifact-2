import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDataService } from '../services/trip-data';
import type { Trip } from '../models/trip';
import { trips } from '../data/trips';
import { TripCard } from '../trip-card/trip-card';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard, RouterModule],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css'],
  providers: [TripDataService]
})
export class TripListing implements OnInit {

  // Array used to hold trips retrieved from the API.
  trips: Trip[] = [];

  // Simple status message for debugging or user feedback.
  message = '';

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    private auth: AuthenticationService
  ) {}

  // Load the trips from the API on component initialization.
  ngOnInit(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value) => {
        this.trips = value;

        this.message = value.length
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database';
      },
      error: (err) => console.log('Error:', err)
    });
  }

  // Returns true if the user has a valid JWT token.
  // Enhancement 2: This is used in the template to hide/show trips when logged out.
  public isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  // Returns true if the logged-in user has the admin role.
  // Enhancement 2: Controls visibility of "Add Trip" button and edit actions.
  public isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  // Navigate to the Add Trip page (admin only, checked in template).
  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }
}
