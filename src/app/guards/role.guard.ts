import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const roles = route.data['roles'] as string[];
    const currentUser = this.authService.currentUserValue;
    
    console.log('Route path:', state.url);
    console.log('Required role:', roles);
    console.log('Current user role:', currentUser);
    
    if (!currentUser) {
      console.warn('No current user, redirecting to login');
      this.router.navigate(['/register']);
      return false;
    }
    
    console.log('User role:', currentUser.role);
    const hasRequiredRole = this.authService.hasRole(roles);
    console.log('Required role:', hasRequiredRole);
    
    if (hasRequiredRole) {
      console.log('Access granted');
      return true;
    }

    // role not authorized
    console.warn('Access denied, redirecting to dashboard');
    this.router.navigate(['/dashboard']);
    return false;
  }
}