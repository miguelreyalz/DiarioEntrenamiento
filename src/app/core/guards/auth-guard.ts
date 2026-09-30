import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async () => {

  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const {
    data: { session }
  } = await supabaseService.client.auth.getSession();

  if (session) {
    return true;
  }

  return router.createUrlTree(['/login']);
};