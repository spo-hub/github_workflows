import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { type User } from '../../schemas/generated/schemas';

import { UserService } from './user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers()', () => {
    it('should return validated users', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
      ];

      const userPromise = firstValueFrom(service.getUsers());

      const req = httpMock.expectOne(`${apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);

      const users = await userPromise;
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    it('should throw error for invalid user data', async () => {
      const invalidUsers = [{ id: 1, name: 'John', email: 'invalid-email', role: 'admin' }];

      const userPromise = firstValueFrom(service.getUsers());

      const req = httpMock.expectOne(`${apiUrl}/users`);
      req.flush(invalidUsers);

      await expect(userPromise).rejects.toThrow('Invalid user data');
    });

    it('should throw error for missing required fields', async () => {
      const invalidUsers = [{ id: 1, name: 'John' }];

      const userPromise = firstValueFrom(service.getUsers());

      const req = httpMock.expectOne(`${apiUrl}/users`);
      req.flush(invalidUsers);

      await expect(userPromise).rejects.toThrow('Invalid user data');
    });

    it('should throw error for invalid role enum', async () => {
      const invalidUsers = [{ id: 1, name: 'John', email: 'john@example.com', role: 'superadmin' }];

      const userPromise = firstValueFrom(service.getUsers());

      const req = httpMock.expectOne(`${apiUrl}/users`);
      req.flush(invalidUsers);

      await expect(userPromise).rejects.toThrow('Invalid user data');
    });
  });

  describe('getUser()', () => {
    it('should return validated single user', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      };

      const userPromise = firstValueFrom(service.getUser(1));

      const req = httpMock.expectOne(`${apiUrl}/users/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      const user = await userPromise;
      expect(user).toEqual(mockUser);
    });

    it('should throw error for invalid user data', async () => {
      const invalidUser = {
        id: 1,
        name: 'John',
        email: 'not-an-email',
        role: 'admin',
      };

      const userPromise = firstValueFrom(service.getUser(1));

      const req = httpMock.expectOne(`${apiUrl}/users/1`);
      req.flush(invalidUser);

      await expect(userPromise).rejects.toThrow('Invalid user data');
    });
  });

  describe('createUser()', () => {
    it('should create and return validated user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        role: 'user' as const,
      };

      const createdUser: User = {
        id: 3,
        ...newUser,
      };

      const userPromise = firstValueFrom(service.createUser(newUser));

      const req = httpMock.expectOne(`${apiUrl}/users`);
      req.flush(createdUser);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);

      const newlyCreatedUser = await userPromise;
      expect(newlyCreatedUser).toEqual(createdUser);
    });

    it('should throw errror for invalid request data', () => {
      const invalidUser = {
        name: 'New User',
        email: 'invalid-email',
        role: 'user' as const,
      };

      expect(() => {
        service.createUser(invalidUser);
      }).toThrow();
    });
  });

  describe('deleteUser()', () => {
    it('should delete user', async () => {
      const userPromise = firstValueFrom(service.deleteUser(1));

      const req = httpMock.expectOne(`${apiUrl}/users/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(true);

      const res = await userPromise;
      expect(res).toBe(true);
    });
  });
});
