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
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private generateRandomSupplierId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser: User = {
          id: newId,
          username: userData.username!,
          password: userData.password!,
          role: userData.role!,
          supplierId: userData.role === 'supplier' ? this.generateRandomSupplierId() : 0
        };

        this.http.post<User>(this.apiUrl, newUser).subscribe();
        return newUser;
      })
    );
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) return null;

        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);

        return user;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  updateCurrentUser(updatedUser: User): void {
    this.http.put(`${this.apiUrl}/${updatedUser.id}`, updatedUser).pipe(
      tap(() => {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return of(null);
      })
    ).subscribe();
  }

  logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return !!user && roles.includes(user.role);
  }
}
