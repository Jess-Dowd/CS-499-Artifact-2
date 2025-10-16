import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDataService } from '../services/trip-data';
import type { Trip } from '../models/trip';
import { trips } from '../data/trips';
import { TripCard } from '../trip-card/trip-card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css'],
  providers: [TripDataService]   // as the guide requests
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router
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

  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }
}