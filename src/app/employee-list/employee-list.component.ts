import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

const GET_EMPLOYEES = gql`
  query {
    getAllEmployees {
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

const SEARCH_EMPLOYEES = gql`
  query search($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
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

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployeeById($eid: ID!) {
    deleteEmployeeById(eid: $eid)
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  searchDesignation: string = '';
  searchDepartment: string = '';

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.apollo.watchQuery({ query: GET_EMPLOYEES })
      .valueChanges.subscribe((result: any) => {
        this.employees = result.data.getAllEmployees;
      });
  }

  searchEmployees() {
    this.apollo.query({
      query: SEARCH_EMPLOYEES,
      variables: {
        designation: this.searchDesignation || null,
        department: this.searchDepartment || null
      }
    }).subscribe((result: any) => {
      this.employees = result.data.searchEmployeeByDesignationOrDepartment;
    });
  }

  resetSearch() {
    this.searchDesignation = '';
    this.searchDepartment = '';
    this.loadEmployees();
  }

  addEmployee() {
    this.router.navigate(['/employee_add']);
  }

  updateEmployee(id: string) {
    this.router.navigate(['/employee_edit', id]);
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employee_view', id]);
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { eid: id }
      }).subscribe(() => {
        this.employees = this.employees.filter(emp => emp._id !== id);
      });
    }
  }
}
