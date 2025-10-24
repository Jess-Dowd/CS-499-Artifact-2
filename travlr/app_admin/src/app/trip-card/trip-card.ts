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
  styleUrls: ['./trip-card.css']   // ← plural
})
export class TripCard {
  @Input('trip') trip!: Trip;

  
  constructor(private router: Router, private authenticationService: AuthenticationService) {}



  editTrip(trip: Trip) {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }
  
  isLoggedIn(): boolean {
     return this.authenticationService.isLoggedIn(); 
  }

}
