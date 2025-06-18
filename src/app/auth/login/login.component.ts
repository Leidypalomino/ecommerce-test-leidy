// frontend/src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Añade ReactiveFormsModule aquí
import { Router, RouterModule } from '@angular/router'; // Asegúrate de que RouterModule esté aquí
import { CommonModule } from '@angular/common'; // <-- ¡Importa esto!

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true, // Esto debería estar aquí si es standalone
  imports: [ // <-- ¡Añade CommonModule y otros aquí!
    CommonModule,
    ReactiveFormsModule,
    RouterModule // Para que [routerLink] funcione
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulario de Login Válido:', this.loginForm.value);
      this.router.navigate(['/auth/profile']);
    } else {
      console.log('Formulario de Login Inválido:', this.loginForm.value);
      this.loginForm.markAllAsTouched();
    }
  }
}