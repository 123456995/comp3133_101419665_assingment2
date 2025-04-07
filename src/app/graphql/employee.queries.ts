import { gql } from 'apollo-angular';

// Adjust fields based on your actual backend schema
export const GET_EMPLOYEES = gql`
  query GetEmployees($department: String, $position: String) { # Add filters if implemented
    employees(department: $department, position: $position) {
      id
      firstName
      lastName
      email
      # Add other fields needed for the list view (e.g., department, position)
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($id: ID!) {
    employee(id: $id) {
      id
      firstName
      lastName
      email
      gender
      salary
      # Add profilePicture field (e.g., profilePictureUrl) if available and needed
    }
  }
`;