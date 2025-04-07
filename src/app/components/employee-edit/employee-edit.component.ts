import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  editForm!: FormGroup; // Definite assignment
  employeeId: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      salary: [null, [Validators.min(0)]]

    });

    this.route.paramMap.pipe(
      switchMap(params => {
        this.employeeId = params.get('id');
        if (!this.employeeId) {
          this.errorMessage = "Employee ID not found in URL.";
          this.isLoading = false;
          throw new Error('Employee ID not found');
        }
        return this.employeeService.getEmployeeById(this.employeeId);
      })
    ).subscribe({
      next: (employee) => {
        if (employee) {
           this.editForm.patchValue({
             firstName: employee.firstName,
             lastName: employee.lastName,
             email: employee.email,
             gender: employee.gender,
             salary: employee.salary
           });
        } else {
           this.errorMessage = "Employee not found.";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching employee details:", err);
        this.errorMessage = err.message || "Failed to load employee data.";
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.editForm.invalid) {
      this.errorMessage = "Please correct the errors in the form.";
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.employeeId) {
        this.errorMessage = "Cannot update employee without ID.";
        return;
    }

    const updatedData = { ...this.editForm.value };

     if (updatedData.salary === '' || updatedData.salary === null) {
         delete updatedData.salary; // Don't send if empty/null, backend should handle partial update
     } else {
         updatedData.salary = parseFloat(updatedData.salary);
          if (isNaN(updatedData.salary)) {
              this.errorMessage = "Invalid salary value.";
              return;
          }
     }


    this.employeeService.updateEmployee(this.employeeId, updatedData).subscribe({
      next: (response) => {
        console.log('Employee updated successfully:', response);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.errorMessage = error.message || 'An error occurred while updating the employee.';
      }
    });
  }
}