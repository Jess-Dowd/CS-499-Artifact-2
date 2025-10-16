import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Trip } from '../models/trip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrls: ['./trip-card.css']   // ← plural
})
export class TripCard {
  @Input('trip') trip!: Trip;

  constructor(private router: Router) {}

  editTrip(trip: Trip) {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }

}
