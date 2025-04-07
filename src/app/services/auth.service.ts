import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/auth.mutations'; // Adjust path

const AUTH_TOKEN_KEY = 'authToken'; // Key for localStorage

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private apollo: Apollo, private router: Router) {
    // Check for existing token on service initialization
    this.loadToken();
  }

  login(credentials: any): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: credentials
    }).pipe(
      tap((result: any) => {
        // Adjust path to token based on your GraphQL response structure
        const token = result?.data?.login?.token;
        if (token) {
          this.setToken(token);
        } else {
          console.error("Login failed: No token received");
          // Handle error appropriately (e.g., show message to user)
        }
      })
    );
  }

  signup(userData: any): Observable<any> {
     return this.apollo.mutate({
       mutation: SIGNUP_MUTATION,
       variables: userData
     });
     // Handle success/error (e.g., navigate to login on success)
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.isAuthenticated.next(true);
    // Optionally store user info as well
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.isAuthenticated.next(false);
    // Clear any stored user info
  }

  private loadToken(): void {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      this.token = storedToken;
      this.isAuthenticated.next(true);
      // You might want to add token validation logic here (e.g., check expiry)
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

   // Helper to check sync status if needed, but observable is better
  isLoggedInSync(): boolean {
    return !!this.token;
  }
}