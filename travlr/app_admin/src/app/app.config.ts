import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptProvider } from './utils/jwt-interceptor';

/* appConfig
 * This sets up the main Angular application settings.
 * It wires up routing, HTTP, error handling, and global features.
 *
 * Enhancement 2:
 * - The JWT interceptor was added to attach tokens to all API requests.
 * 
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Global Angular error listeners
    provideBrowserGlobalErrorListeners(),

    // Improves performance by coalescing certain events
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Enable client-side routing using app.routes.ts
    provideRouter(routes),

    // Enable HttpClient support + allow interceptors (JWT)
    provideHttpClient(withInterceptorsFromDi()),

    // Enhancement 2:
    // Automatically attaches JWT token to outgoing API requests
    authInterceptProvider
  ]
};
