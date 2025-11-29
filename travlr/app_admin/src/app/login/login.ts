import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  // Holds login error messages
  public formError = '';

  // Used for basic form validation state
  submitted = false;

  // Model bound to the login form fields
  credentials = { name: '', email: '', password: '' };

  constructor(private router: Router, private auth: AuthenticationService) {}
  ngOnInit(): void {}

  // Handles login button click.
  // Checks required fields before attempting login.
  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.name) {
      this.formError = 'All fields are required, please try again';
      return;
    }
    this.doLogin();
  }

  // Calls the authentication service to perform login.
  // Login existed before, but Enhancement 2 adds role-based checks
  // and the JWT now includes the "role" field used later in the app.
  private doLogin(): void {
    const user = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // Sends login request and stores JWT internally
    this.auth.login(user, this.credentials.password);

    // If authenticated right away, navigate home
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['']);
    } else {
      // Small delay to allow async login to complete
      setTimeout(() => {
        if (this.auth.isLoggedIn()) {
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}
