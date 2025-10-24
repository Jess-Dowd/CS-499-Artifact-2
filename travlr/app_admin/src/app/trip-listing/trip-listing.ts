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
  providers: [TripDataService]   // as the guide requests
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message = '';

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    private auth: AuthenticationService
  ) {}


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

  public isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  // public addTrip(){ this.router.navigate(['add']); }


  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }
}