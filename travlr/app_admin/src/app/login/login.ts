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
  public formError = '';
  submitted = false;

  credentials = { name: '', email: '', password: '' };

  constructor(private router: Router, private auth: AuthenticationService) {}
  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.name) {
      this.formError = 'All fields are required, please try again';
      return;
    }
    this.doLogin();
  }

  private doLogin(): void {
    const user = { name: this.credentials.name, email: this.credentials.email } as User;
    this.auth.login(user, this.credentials.password);

    if (this.auth.isLoggedIn()) {
      this.router.navigate(['']);
    } else {
      setTimeout(() => { if (this.auth.isLoggedIn()) this.router.navigate(['']); }, 3000);
    }
  }
}
