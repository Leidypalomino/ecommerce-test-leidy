// frontend/src/app/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Añade ReactiveFormsModule
import { Router, RouterModule } from '@angular/router'; // Asegúrate de que RouterModule esté aquí
import { CommonModule } from '@angular/common'; // <-- ¡Importa esto!

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true, // Esto debería estar aquí
  imports: [ // <-- ¡Añade CommonModule y otros aquí!
    CommonModule,
    ReactiveFormsModule,
    RouterModule // Para que [routerLink] funcione
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario de Registro Válido:', this.registerForm.value);
      this.router.navigate(['/auth/login']);
    } else {
      console.log('Formulario de Registro Inválido:', this.registerForm.value);
      this.registerForm.markAllAsTouched();
    }
  }
}