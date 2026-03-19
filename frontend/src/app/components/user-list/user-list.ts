// import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { UserService } from '../../services/User/user';
import { type User } from '../../schemas/generated/schemas';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private userService = inject(UserService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
        console.log('Users loaded:', users);
      },
      error: (err) => {
        this.error.set('Failed to load users');
        this.loading.set(false);
        console.error('Error loading users:', err);
      },
    });
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService.deleteUser(id).subscribe({
      next: () => {
        console.log('✅ User deleted');
        this.users.set(this.users().filter((u) => u.id !== id));
      },
      error: (err) => {
        console.error('❌ Error deleting user:', err);
        this.error.set('Failed to delete user. Please try again');
      },
    });
  }
}
