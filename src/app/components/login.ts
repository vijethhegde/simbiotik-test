
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MATERIAL_IMPORTS } from '../shared/material.imports';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.error = null;
    this.loading = true;

    this.http.post<{ token: string }>(
      'api/users/login',
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: (res: any) => {
        localStorage.setItem('authToken', res?.accessToken);
        if(res?.accessToken){
          this.router.navigate(['/practice-tests']);
        }
        // snackBar.open('Message archived');
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('Login error:', err);
      }
    });
  }
}


// this.http.post<{ token: string }>(
//   'https://reqres.in/api/login',
//   { email: usernameOrEmail, password }
// ).subscribe({
//   next: res => {
//     localStorage.setItem('authToken', res.token);
//     this.router.navigate(['/todo']); // or wherever
//   },
//   error: err => { this.error = 'Login failed'; }
// });
