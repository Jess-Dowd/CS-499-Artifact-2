import { Routes } from '@angular/router';
import { TripListing } from './trip-listing/trip-listing';
import { AddTrip } from './add-trip/add-trip';
import { EditTripComponent } from './edit-trip/edit-trip';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  { path: '', component: TripListing },
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTripComponent },
  { path: 'login', component: LoginComponent }
];

