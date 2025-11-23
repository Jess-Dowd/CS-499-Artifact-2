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

  public getToken(): string {
    const t = this.storage.getItem('travlr-token');
    return t || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

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

  public getCurrentUser() {
  const token = this.getToken();
  if (!token) {
    return null;
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  // token now has: _id, email, name, role
  return {
    email: payload.email,
    name: payload.name,
    role: payload.role || 'viewer'
  };
}

  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'admin';
  }

  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: any) => {
        if (value?.token) this.saveToken(value.token);
      },
      error: (e) => console.log('Auth login error:', e)
    });
  }

  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: any) => {
        if (value?.token) this.saveToken(value.token);
      },
      error: (e) => console.log('Auth register error:', e)
    });
  }
}
