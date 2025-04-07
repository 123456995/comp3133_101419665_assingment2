import { gql } from 'apollo-angular';

// Adjust input types (e.g., EmployeeInput) and returned fields based on your schema
// If using direct file upload via GraphQL, ensure backend supports 'Upload' scalar
export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $gender: String,
      $salary: Float,
      $profilePicture: Upload # Use 'Upload' scalar if backend configured, otherwise maybe String for URL
    ) {
    addEmployee(
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        gender: $gender,
        salary: $salary,
        profilePicture: $profilePicture # Or however your backend accepts picture info
      ) {
      id # Request necessary fields, ID is crucial for cache updates
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
      $id: ID!,
      $firstName: String,
      $lastName: String,
      $email: String,
      $gender: String,
      $salary: Float
      # Add profilePicture update logic if needed
    ) {
    updateEmployee(
        id: $id,
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        gender: $gender,
        salary: $salary
      ) {
      id # Return updated fields or just ID
      firstName
      lastName
      email
      gender
      salary
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id # Returning ID helps Apollo cache know which item was removed
    }
  }
`;