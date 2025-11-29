import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  authResp: AuthResponse = new AuthResponse();

  // Get JWT token from browser storage
  public getToken(): string {
    const t = this.storage.getItem('travlr-token');
    return t || '';
  }

  // Save JWT to storage after login/register
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Remove token to log out user
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Check if a valid (non-expired) token exists
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } catch {
      return false;
    }
  }

  // Decode token and return current user data
  // Token includes: _id, email, name, role
  public getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.email,
      name: payload.name,
      role: payload.role || 'viewer'   // Default role
    };
  }

  // True if the user's role in the token is admin
  // Enhancement 2: Used to control access to the admin user directory page.
  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'admin';
  }

  // Login via API, then store the returned JWT
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: any) => {
        if (value?.token) this.saveToken(value.token);
      },
      error: (e) => console.log('Auth login error:', e)
    });
  }

  // Register via API, then store the returned JWT
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: any) => {
        if (value?.token) this.saveToken(value.token);
      },
      error: (e) => console.log('Auth register error:', e)
    });
  }
}
