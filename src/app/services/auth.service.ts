import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'api/users';
  private readonly USER_STORAGE_KEY = 'current_user';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: Partial<User>): Observable<User> {
    
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const newId = Math.max(...users.map(u => u.id)) + 1;
        const newUser: User = {
          id: newId,
          username: userData.username!,
          password: userData.password!,
          role: userData.role!,
          supplierId: userData.role === 'supplier' ? newId : 0
        };
        
        // Add to users array
        users.push(newUser);
        // Update the in-memory database
        this.http.post(this.apiUrl, newUser).subscribe();
        return newUser;
      })
    );
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }


  updateCurrentUser(updatedUser: User): void {
    // Update in the service
    this.http.put(`${this.apiUrl}`, updatedUser).pipe(
      tap(() => {
        // Update in local storage
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));
        // Update the behavior subject
        this.currentUserSubject.next(updatedUser);
        console.log('User updated successfully:', updatedUser);
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        // Still update local storage and subject even if HTTP request fails
        // This ensures UI remains consistent
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return of(updatedUser);
      })
    ).subscribe();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return !!user && roles.includes(user.role);
  }
  
}