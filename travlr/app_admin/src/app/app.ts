import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TripListing } from './trip-listing/trip-listing';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TripListing, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  /* Root component for the Angular SPA.
   * Everything inside the app loads through this component.
   * It contains the navbar and whichever routed page is active.
   *
   * Enhancement 2: RBAC login system affects what appears inside the navbar
   * and which routes users can access, but the App component itself was not changed.
   *
   * Enhancement 3: Admin Users page added to the routing, so the App now
   * indirectly hosts the new admin interface through RouterOutlet.
   */
  protected readonly title = ('Travlr Gateways Admin!');
}
