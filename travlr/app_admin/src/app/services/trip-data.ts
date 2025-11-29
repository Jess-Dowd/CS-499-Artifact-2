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

  // Trip endpoints -----------------------------------------------------
 // -------------------------------------------------------------------
  // Trip endpoints
  // Basic CRUD calls for trips. Enhancement 2 restricts these in backend
  // so only admins can create/update/delete.
  // -------------------------------------------------------------------

  // Get all trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  // Get a single trip by its trip code
  getTrip(code: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/trips/${encodeURIComponent(code)}`);
  }

  // Create a new trip (admin only – RBAC enforced in Enhancement 2)
  addTrip(trip: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/trips`, trip);
  }

  // Update an existing trip (admin only – RBAC enforced in Enhancement 2)
  updateTrip(trip: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${encodeURIComponent(trip.code)}`, trip);
  }

  // Delete a trip (admin only – RBAC enforced in Enhancement 2)
  deleteTrip(code: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/trips/${encodeURIComponent(code)}`);
  }
  
  // -------------------------------------------------------------------
  // Auth endpoints
  // Used for logging in and registering. Enhancement 2 adds RBAC logic
  // in backend and the SPA interprets role from returned JWT.
  // -------------------------------------------------------------------

  // Login user, returns JWT token
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      name: user.name, email: user.email, password: passwd
    });
  }

  // Register user, returns JWT token
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, {
      name: user.name, email: user.email, password: passwd
    });
  }

  // Admin user management (Enhancement 3) ------------------------------

  // Get list of all users (admin only)
  // Enhancement 3: Added for the new admin user directory page.
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  // Update a user by ID (admin only)
  // Enhancement 3: Used when admin changes a user's role or info.
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }
}
