import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      username
      email
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private apollo: Apollo, private router: Router) {}

  signup() {
    this.error = '';
    this.loading = true;

    // ✅ Basic client-side validation
    if (!this.username.trim() || !this.email.trim() || !this.password.trim()) {
      this.error = 'All fields are required.';
      this.loading = false;
      return;
    }

    // ✅ Trigger GraphQL signup mutation
    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        username: this.username.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password, // hash happens on backend
      }
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const message = err?.graphQLErrors?.[0]?.message || 'Signup failed. Try again.';
        this.error = message;
        console.error('Signup error:', err);
      }
    });
  }
}
