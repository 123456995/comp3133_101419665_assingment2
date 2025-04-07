import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // or .scss
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Definite assignment assertion
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Match variable names expected by your LOGIN_MUTATION
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Check if login was successful (e.g., token received in service)
           if (this.authService.isLoggedInSync()) { // Check sync status after login attempt
              console.log('Login successful', response);
              this.router.navigate(['/employees']);
           } else {
             // Handle cases where mutation succeeded but didn't return expected data
             this.errorMessage = 'Login failed: Invalid credentials or server error.';
           }
        },
        error: (error) => {
          console.error('Login error:', error);
          // Extract meaningful error message if possible
          this.errorMessage = error.message || 'An error occurred during login.';
        }
      });
    } else {
       this.errorMessage = 'Please fill in all required fields.';
    }
  }
}