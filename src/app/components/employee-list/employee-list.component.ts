import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  loading = true;
  error: any = null;
  private querySubscription: Subscription | undefined;

  searchDepartment: string = '';
  searchPosition: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.loading = true;
    this.error = null;

    const filters: any = {};
    if (this.searchDepartment) filters.department = this.searchDepartment;
    if (this.searchPosition) filters.position = this.searchPosition;

    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    this.querySubscription = this.employeeService.getEmployees(filters).subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        this.error = err.message || 'Failed to load employees.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.fetchEmployees();
  }

  viewDetails(id: string): void {
     this.router.navigate(['/employees/view', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete employee ${name} (ID: ${id})?`)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log(`Employee ${id} deleted`);
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          // Show an error message
          alert(`Failed to delete employee: ${err.message}`);
        }
      });
    }
  }

  navigateToAddEmployee(): void {
     this.router.navigate(['/employees/add']);
  }

  ngOnDestroy(): void {
     if (this.querySubscription) {
       this.querySubscription.unsubscribe();
     }
  }
}