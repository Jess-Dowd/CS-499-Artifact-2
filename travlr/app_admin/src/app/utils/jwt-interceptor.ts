import { Injectable, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthApi = request.url.endsWith('/login') || request.url.endsWith('/register');
    if (this.auth.isLoggedIn() && !isAuthApi) {
      const token = this.auth.getToken();
      const authed = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(authed);
    }
    return next.handle(request);
  }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
};
