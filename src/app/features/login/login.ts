import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly router: Router
  ) {}


  async login(): Promise<void> {

    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = 'Introduce tu email y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password: this.password
      });

    this.loading = false;

    if (error) {
      console.error(error);

      this.errorMessage =
        'Email o contraseña incorrectos.';

      return;
    }

    console.log(
      'Usuario conectado:',
      data.user
    );

    await this.router.navigate(['/']);
  }
}