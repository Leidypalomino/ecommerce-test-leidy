import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- importa esto
import { Theme } from './core/theme';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isDarkMode$!: Observable<boolean>;
  isAuthenticated = false;

  constructor(private themeService: Theme, private router: Router) {}

  ngOnInit() {
    this.isDarkMode$ = this.themeService.darkMode$;
    this.isAuthenticated = !!localStorage.getItem('token'); // <-- aquí
  }

  toggleTheme(): void {
    this.themeService.toggleTheme(); // Delega la acción al servicio
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload();
    });
  }

  updateAuthStatus() {
    this.isAuthenticated = !!localStorage.getItem('token');
  }
}