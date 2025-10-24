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
  constructor(private auth: AuthenticationService) {}
  ngOnInit(): void {}

  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  onLogout(): void { this.auth.logout(); }
}
