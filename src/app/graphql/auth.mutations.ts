import { gql } from 'apollo-angular';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      # Adjust field names based on your backend schema
      token
      userId
      username
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
       # Adjust field names based on your backend schema
      id
      username
      email
    }
  }
`;