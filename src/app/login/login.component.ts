import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 

const LOGIN_QUERY = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private apollo: Apollo, private router: Router) {}

  login() {
    this.apollo.watchQuery({
      query: LOGIN_QUERY,
      variables: { username: this.username, password: this.password },
    }).valueChanges.subscribe({
      next: (result: any) => {
        const token = result.data.login.token;
        localStorage.setItem('token', token);
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.error = 'Invalid login. Please try again.';
      }
    });
  }
}