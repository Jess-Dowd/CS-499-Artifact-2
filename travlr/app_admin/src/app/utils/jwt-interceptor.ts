import { Injectable, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {}

  /* Intercepts every outgoing HTTP request.
   * Enhancement 2: This is part of the RBAC and JWT authentication enhancement.
   * When the user is logged in, this interceptor attaches the JWT token
   * to all API requests except login and registration.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Do NOT attach a JWT when calling /login or /register
    const isAuthApi = request.url.endsWith('/login') || request.url.endsWith('/register');

    // If logged in, attach the JWT token to request headers
    if (this.auth.isLoggedIn() && !isAuthApi) {
      const token = this.auth.getToken();
      const authed = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authed);
    }

    // If not logged in (or calling login/register), send request unchanged
    return next.handle(request);
  }
}

/* Registers the JWT interceptor globally.
 * Angular will run this interceptor on every HTTP request.
 */
export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
