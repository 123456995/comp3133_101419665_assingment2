import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const GET_EMPLOYEE = gql`
  query getEmployeeById($eid: ID!) {
    getEmployeeById(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation updateEmployeeById(
    $eid: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $salary: Float
    $date_of_joining: String
    $department: String
    $employee_photo: String
  ) {
    updateEmployeeById(
      eid: $eid
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
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent implements OnInit {
  id = '';
  first_name = '';
  last_name = '';
  email = '';
  gender = 'Other';
  designation = '';
  salary = 0;
  date_of_joining = '';
  department = '';
  employee_photo = '';

  constructor(private route: ActivatedRoute, private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.apollo.watchQuery({
      query: GET_EMPLOYEE,
      variables: { eid: this.id }
    }).valueChanges.subscribe((result: any) => {
      const emp = result.data.getEmployeeById;
      this.first_name = emp.first_name;
      this.last_name = emp.last_name;
      this.email = emp.email;
      this.gender = emp.gender;
      this.designation = emp.designation;
      this.salary = emp.salary;
      this.date_of_joining = emp.date_of_joining?.substring(0, 10); // format for input[type="date"]
      this.department = emp.department;
      this.employee_photo = emp.employee_photo;
    });
  }

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
      mutation: UPDATE_EMPLOYEE,
      variables: {
        eid: this.id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        designation: this.designation,
        salary: this.salary,
        date_of_joining: this.date_of_joining,
        department: this.department,
        employee_photo: this.employee_photo
      }
    }).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
