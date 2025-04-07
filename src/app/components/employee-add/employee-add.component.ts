import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service'; // Adjust path

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  addForm!: FormGroup; // Definite assignment
  errorMessage: string | null = null;
  selectedFile: File | null = null; // For file upload

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      // Match names with GraphQL mutation variables
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''], // Optional
      salary: [null, [Validators.min(0)]], // Optional, numeric
      // Don't include profilePicture form control here if handled separately
    });
  }

  // Handle file selection
  onFileSelected(event: Event): void {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList && fileList.length > 0) {
          this.selectedFile = fileList[0];
           console.log("File selected:", this.selectedFile.name);
      } else {
          this.selectedFile = null;
      }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.addForm.invalid) {
      this.errorMessage = "Please correct the errors in the form.";
      this.addForm.markAllAsTouched();
      return;
    }

    const employeeData = this.addForm.value;

    if (employeeData.salary === '' || employeeData.salary === null) {
        delete employeeData.salary;
    } else {
        employeeData.salary = parseFloat(employeeData.salary);
         if (isNaN(employeeData.salary)) {
             this.errorMessage = "Invalid salary value.";
             return;
         }
    }


    console.log("Submitting data:", employeeData);
    console.log("Submitting file:", this.selectedFile?.name);


    this.employeeService.addEmployee(employeeData, this.selectedFile).subscribe({
      next: (response) => {
        console.log('Employee added successfully:', response);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        this.errorMessage = error.message || 'An error occurred while adding the employee.';
         if (error.graphQLErrors) {
            this.errorMessage = error.graphQLErrors.map((e:any) => e.message).join(', ');
         }
      }
    });
  }
}