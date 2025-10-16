import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Trip } from '../models/trip';

@Injectable({ providedIn: 'root' })
export class TripDataService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }
}