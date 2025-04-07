import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust path
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>; // Observable for async pipe

  constructor(public authService: AuthService, private router: Router) {
      this.isLoggedIn$ = this.authService.isLoggedIn(); // Get observable
  }

  logout(): void {
    this.authService.logout(); // Service handles token removal and redirect
  }
}