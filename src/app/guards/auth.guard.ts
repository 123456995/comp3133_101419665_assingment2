import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Adjust path

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Use the observable from AuthService for reactive checks
    return this.authService.isLoggedIn().pipe(
        take(1), // Take the first emission
        map(isAuth => {
           if (isAuth) {
             return true; // Allow navigation
           }
           // Not authenticated, redirect to login
           console.log('AuthGuard: User not authenticated, redirecting to /login');
           return this.router.createUrlTree(['/login']);
        })
    );

    // // --- OR a simpler synchronous check (less reactive but often sufficient) ---
    // if (this.authService.isLoggedInSync()) {
    //   return true;
    // } else {
    //   console.log('AuthGuard: User not authenticated, redirecting to /login');
    //   this.router.navigate(['/login']);
    //   return false;
    // }
  }
}