export interface User {
    id: number;
    username: string;
    password: string;
    role: 'manager' | 'supplier';
    supplierId: number;  // If user is a supplier
  }
  