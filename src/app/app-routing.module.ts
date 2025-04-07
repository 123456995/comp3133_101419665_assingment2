import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component'; // If separate page
// Import your AuthGuard later

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // Add AuthGuard later to protect these routes
  { path: 'employees', component: EmployeeListComponent /*, canActivate: [AuthGuard] */ },
  { path: 'employees/add', component: EmployeeAddComponent /*, canActivate: [AuthGuard] */ },
  { path: 'employees/edit/:id', component: EmployeeEditComponent /*, canActivate: [AuthGuard] */ },
  { path: 'employees/view/:id', component: EmployeeDetailsComponent /*, canActivate: [AuthGuard] */ }, // Optional route
  // Redirect base path to login or employees depending on auth status (handle in AppComponent or guard)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Wildcard route for 404 Not Found (Optional)
  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }