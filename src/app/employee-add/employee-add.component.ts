import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $designation: String!
    $salary: Float!
    $date_of_joining: String!
    $department: String!
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      _id
    }
  }
`;

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent {
  first_name = '';
  last_name = '';
  email = '';
  gender = 'Other';
  designation = '';
  salary: number = 0;
  date_of_joining = '';
  department = '';
  employee_photo = ''; // Base64 string

  constructor(private apollo: Apollo, private router: Router) {}

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.employee_photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  save() {
    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        designation: this.designation,
        salary: this.salary,
        date_of_joining: this.date_of_joining,
        department: this.department,
        employee_photo: this.employee_photo || ''
      }
    }).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
