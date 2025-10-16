import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDataService } from '../services/trip-data';
import type { Trip } from '../models/trip';
import { trips } from '../data/trips';
import { TripCard } from '../trip-card/trip-card';


@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css'],
  providers: [TripDataService]   // as the guide requests
})
export class TripListing implements OnInit { trips: Array<any> = trips; ngOnInit(): void {} }
