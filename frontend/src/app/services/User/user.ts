import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UserSchema,
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
} from '../../schemas/generated/schemas';
import z from 'zod';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api';

  getUsers(): Observable<User[]> {
    return this.http.get(`${this.apiUrl}/users`).pipe(
      map((response) => {
        try {
          return z.array(UserSchema).parse(response);
        } catch (error) {
          console.error('User List validation failed:', error);
          throw new Error('Invalid user data received from API', { cause: error });
        }
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get(`${this.apiUrl}/users/${id}`).pipe(
      map((response) => {
        try {
          return UserSchema.parse(response);
        } catch (error) {
          console.error('User validation failed:', error);
          throw new Error('Invalid user data received from API', { cause: error });
        }
      })
    );
  }

  createUser(user: CreateUserRequest): Observable<User> {
    try {
      const validatedRequest = CreateUserRequestSchema.parse(user);

      return this.http.post(`${this.apiUrl}/users`, validatedRequest).pipe(
        map((response) => {
          try {
            return UserSchema.parse(response);
          } catch (error) {
            console.error('Created user validation failed:', error);
            throw new Error('Invalid user data received from API', { cause: error });
          }
        })
      );
    } catch (error) {
      console.error('Create user reuqest validation failed:', error);
      throw new Error('Invalid user data provided', { cause: error });
    }
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    try {
      const validatedRequest = UpdateUserRequestSchema.parse(user);

      return this.http.put(`${this.apiUrl}/users/${id}`, validatedRequest).pipe(
        map((response) => {
          try {
            return UserSchema.parse(response);
          } catch (error) {
            console.error('Updated user validation failed:', error);
            throw new Error('Invalid user data received from API', { cause: error });
          }
        })
      );
    } catch (error) {
      console.error('Updated user validation failed:', error);
      throw new Error('Invalid user data provided', { cause: error });
    }
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
