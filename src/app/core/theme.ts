// frontend/src/app/core/theme.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private _darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this._darkMode.asObservable(); // Observable para que los componentes se suscriban

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Si estamos en el navegador, inicializamos el tema
      this.loadTheme();
    }
  }

  private loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.setTheme(savedTheme === 'dark');
      } else {
        // Si no hay tema guardado, usa la preferencia del sistema operativo
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark);
      }
    }
  }

  setTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement; // Elemento <html>

      if (isDark) {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      this._darkMode.next(isDark); // Notifica a los suscriptores el cambio
    }
  }

  toggleTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentMode = this._darkMode.value;
      this.setTheme(!currentMode);
    }
  }

  isDarkMode(): boolean {
    return this._darkMode.value;
  }
}