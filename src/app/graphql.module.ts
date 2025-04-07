import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_EMPLOYEES, GET_EMPLOYEE_BY_ID } from './graphql/employee.queries'; // Adjust paths
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from './graphql/employee.mutations';
// Import createUploadLink if using apollo-upload-client for file uploads
// You might need to adjust graphql.module.ts if using file uploads directly

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesQueryRef: QueryRef<any> | undefined;

  constructor(private apollo: Apollo) {}

  // Fetch employees, potentially with filters
  getEmployees(filters?: { department?: string; position?: string }): Observable<any[]> {
    this.employeesQueryRef = this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES,
      variables: filters || {}, // Pass filters or empty object
      fetchPolicy: 'cache-and-network', // Good default: check cache, then network
      errorPolicy: 'all'
    });

    return this.employeesQueryRef.valueChanges.pipe(
      map(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
        }
        return result?.data?.employees || []; // Handle potential null data
      })
    );
  }

  // Get a single employee by ID
  getEmployeeById(id: string): Observable<any> {
    return this.apollo.query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only' // Often best to get fresh data for details/edit
    }).pipe(
      map(result => result?.data?.employee)
    );
  }

  // Add a new employee (handle file upload if necessary)
  addEmployee(employeeData: any, profilePictureFile?: File | null): Observable<any> {
    const mutationOptions: any = { // Use 'any' for flexibility with context
      mutation: ADD_EMPLOYEE,
      variables: { ...employeeData },
       refetchQueries: [{ query: GET_EMPLOYEES, variables: {} }] // Refetch list after adding
       // Or use cache update function for more control
    };

    // If a file is provided and using apollo-upload-client
    if (profilePictureFile) {
       variables.profilePicture = profilePictureFile;
       // Context needed for apollo-upload-client link
       mutationOptions.context = { useMultipart: true };
    } else {
       // Ensure profilePicture variable isn't sent if null/undefined and backend expects Upload
       // Or set it to null if backend accepts null
       variables.profilePicture = null; // Or remove if not needed when no file
    }


    return this.apollo.mutate(mutationOptions).pipe(
      map(result => result?.data?.addEmployee)
    );
  }


  // Update an existing employee
  updateEmployee(id: string, employeeData: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, ...employeeData },
      // Refetch relevant queries or update cache
       refetchQueries: [
         { query: GET_EMPLOYEES, variables: {} }, // Refetch the list
         { query: GET_EMPLOYEE_BY_ID, variables: { id } } // Refetch the specific employee
       ]
    }).pipe(
      map(result => result?.data?.updateEmployee)
    );
  }

  // Delete an employee
  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      // Update cache to remove the employee immediately from the list view
      update: (cache) => {
        try {
            // Read the current list of employees from the cache
            const existingEmployeesData = cache.readQuery<any>({
                query: GET_EMPLOYEES,
                variables: {} // Use same variables as the query you want to update
            });

            if (existingEmployeesData && existingEmployeesData.employees) {
                // Filter out the deleted employee
                const newEmployees = existingEmployeesData.employees.filter((emp: any) => emp.id !== id);
                // Write the updated list back to the cache
                cache.writeQuery({
                    query: GET_EMPLOYEES,
                    variables: {}, // Use same variables
                    data: { employees: newEmployees },
                });
            }
        } catch (e) {
            console.error("Error updating cache after deletion:", e);
            // Cache entry might not exist yet if list wasn't loaded
        }
      }
      // Alternative simple way (less immediate UI update):
      // refetchQueries: [{ query: GET_EMPLOYEES, variables: {} }]
    }).pipe(
      map(result => result?.data?.deleteEmployee)
    );
  }
}