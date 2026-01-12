import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string | undefined;

  if (allowedRoles && !allowedRoles.includes(auth.getRole()!)) {
    alert("You don't have permission to access this page");
    router.navigate(['/home']);
    return false;
  }

  return true;
};
