import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_IMPORTS } from '../shared/material.imports';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  private baseUrl = environment.apiUrl;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    this.loading = true;

    this.http.post<{ accessToken: string }>(
      `${this.baseUrl}/users/login`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.accessToken) {
          localStorage.setItem('authToken', res.accessToken);
          this.snackBar.open('Login successful!', '', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/practice-tests']);
        } else {
          this.snackBar.open('Login failed: No token returned', '', {
            duration: 3000,
            panelClass: ['bg-warning', 'text-dark'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          `Login error: ${err?.error?.message || err.message || 'Unknown error'}`,
          '',
          {
            duration: 3000,
            panelClass: ['bg-danger', 'text-white'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      }
    });
  }
}
