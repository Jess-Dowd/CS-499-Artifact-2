import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  // Give the template access to login status and role checks
  constructor(public auth: AuthenticationService) {}

  ngOnInit(): void {}

  // Checks if a valid JWT exists in storage.
  // Enhancement 2 : hide/show parts of the UI.
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  // Clears JWT from storage and signs the user out.
  // Used by the logout button in the navbar.
  onLogout(): void {
    this.auth.logout();
  }
}
