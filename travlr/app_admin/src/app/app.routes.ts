import { Routes } from '@angular/router';
import { TripListing } from './trip-listing/trip-listing';
import { AddTrip } from './add-trip/add-trip';
import { EditTripComponent } from './edit-trip/edit-trip';
import { LoginComponent } from './login/login';
import { UsersAdminComponent } from './users-admin/users-admin';

// Defines all client-side navigation paths for the Angular SPA.
// Components decide internally whether the user has permission
// Enhancement 2 added RBAC logic such as isAdmin() checks.
export const routes: Routes = [

  // Main home page — shows all trips
  { path: '', component: TripListing },

  // Add a trip page (admin-only; protected in component with isAdmin())
  { path: 'add-trip', component: AddTrip },

  // Edit an existing trip (admin-only; also protected by isAdmin())
  { path: 'edit-trip', component: EditTripComponent },

  // Login screen
  { path: 'login', component: LoginComponent },

  // Enhancement 3:
  // Added new admin user directory route
  // The UsersAdminComponent loads user data and shows the admin UI.
  { path: 'admin/users', component: UsersAdminComponent },
];
