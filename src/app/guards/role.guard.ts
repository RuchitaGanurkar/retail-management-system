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
    
    console.log('Role Guard - Route path:', state.url);
    console.log('Role Guard - Required roles:', roles);
    console.log('Role Guard - Current user:', currentUser);
    
    if (!currentUser) {
      console.warn('Role Guard - No current user, redirecting to login');
      this.router.navigate(['/register']);
      return false;
    }
    
    console.log('Role Guard - User role:', currentUser.role);
    const hasRequiredRole = this.authService.hasRole(roles);
    console.log('Role Guard - Has required role:', hasRequiredRole);
    
    if (hasRequiredRole) {
      console.log('Role Guard - Access granted');
      return true;
    }

    // role not authorized
    console.warn('Role Guard - Access denied, redirecting to dashboard');
    this.router.navigate(['/dashboard']);
    return false;
  }
}