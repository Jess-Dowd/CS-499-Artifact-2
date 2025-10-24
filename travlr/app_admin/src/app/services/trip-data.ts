import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({ providedIn: 'root' })
export class TripDataService {
  baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  getTrip(code: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/trips/${encodeURIComponent(code)}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/trips`, trip);
  }

  updateTrip(trip: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${encodeURIComponent(trip.code)}`, trip);
  }

  deleteTrip(code: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/trips/${encodeURIComponent(code)}`);
  }

  // NEW:
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      name: user.name, email: user.email, password: passwd
    });
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, {
      name: user.name, email: user.email, password: passwd
    });
  }
}
