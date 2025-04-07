import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEE = gql`
  query getEmployeeById($eid: ID!) {
    getEmployeeById(eid: $eid) {
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

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-view.component.html'
})
export class EmployeeViewComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.watchQuery({
      query: GET_EMPLOYEE,
      variables: { eid: id }
    }).valueChanges.subscribe((result: any) => {
      this.employee = result.data.getEmployeeById;
    });
  }
}
